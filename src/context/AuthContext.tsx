import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserRole,
  UserAccount,
  UserStatus,
  CustomRoleDefinition,
  RolePermissions,
  ModuleKey,
  PermissionAction,
  DashboardWidgetKey,
  UserActivityLog,
  LoginActivity
} from '../types';
import {
  SYSTEM_ROLES,
  INITIAL_USER_ACCOUNTS,
  DEFAULT_ROLE_WIDGETS,
  generateDefaultRolePermissions,
  INITIAL_USER_ACTIVITY_LOGS,
  INITIAL_LOGIN_ACTIVITIES
} from '../data/rbacData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  // Current user & authentication
  currentUser: UserAccount | null;
  user: UserAccount | null;
  role: UserRole;
  isAuthenticated: boolean;
  isClient: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => void;

  // Impersonation ("View as User")
  isImpersonating: boolean;
  impersonatedUser: UserAccount | null;
  startImpersonation: (user: UserAccount) => void;
  stopImpersonation: () => void;

  // Permissions & Widgets
  hasPermission: (module: ModuleKey | string, action?: PermissionAction) => boolean;
  hasWidget: (widgetKey: DashboardWidgetKey) => boolean;
  getActiveWidgets: () => DashboardWidgetKey[];

  // User Management (Admin functions)
  users: UserAccount[];
  createUser: (userData: Omit<UserAccount, 'id' | 'created_at' | 'last_login'>) => void;
  updateUser: (id: string, updates: Partial<UserAccount>) => void;
  updateUserProfilePhoto: (userId: string, newPhotoUrl: string) => void;
  toggleUserStatus: (id: string, status: UserStatus) => void;
  deleteUser: (id: string) => void;
  resetUserPassword: (id: string, newPassword?: string) => void;

  // Role Management
  roles: CustomRoleDefinition[];
  createCustomRole: (name: string, description: string, baseRole?: UserRole) => void;
  deleteCustomRole: (key: string) => void;
  permissionsByRole: Record<string, RolePermissions>;
  updateRolePermissions: (roleKey: string, permissions: RolePermissions) => void;
  resetRolePermissions: (roleKey: string) => void;

  // Dashboard Builder Configuration
  dashboardWidgetsByRole: Record<string, DashboardWidgetKey[]>;
  updateDashboardWidgets: (roleKey: string, widgets: DashboardWidgetKey[]) => void;
  updateUserCustomWidgets: (userId: string, widgets: DashboardWidgetKey[]) => void;

  // Audit and Activity logs
  userActivityLogs: UserActivityLog[];
  loginActivities: LoginActivity[];
  logActivity: (action: string, module: string, description: string) => void;

  // Quick switch persona for testing
  switchPersona: (roleKey: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_USERS = 'digiscore_users_v2';
const STORAGE_ROLES = 'digiscore_roles_v2';
const STORAGE_PERMISSIONS = 'digiscore_permissions_v5';
const STORAGE_WIDGETS = 'digiscore_widgets_v3';
const STORAGE_CURRENT_USER_ID = 'digiscore_current_user_id_v2';
const STORAGE_ACTIVITIES = 'digiscore_activities_v2';
const STORAGE_LOGINS = 'digiscore_logins_v2';

function getStoredJSON<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const raw = getStoredJSON(STORAGE_USERS, INITIAL_USER_ACCOUNTS);
    return raw.map(u => {
      if (u.id === 'usr-1' && (!u.avatar_url || u.avatar_url.includes('photo-1534528741775-53994a69daeb'))) {
        return { ...u, avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250' };
      }
      return u;
    });
  });

  // Roles list
  const [roles, setRoles] = useState<CustomRoleDefinition[]>(() =>
    getStoredJSON(STORAGE_ROLES, SYSTEM_ROLES)
  );

  // Role permissions
  const [permissionsByRole, setPermissionsByRole] = useState<Record<string, RolePermissions>>(() => {
    const stored = getStoredJSON<Record<string, RolePermissions> | null>(STORAGE_PERMISSIONS, null);
    if (stored) {
      SYSTEM_ROLES.forEach(r => {
        if (!stored[r.key]) {
          stored[r.key] = generateDefaultRolePermissions(r.key);
        } else if (!stored[r.key].communication || !stored[r.key].communication.view) {
          stored[r.key].communication = {
            view: true,
            create: true,
            edit: false,
            delete: false,
            approve: false,
            export: true
          };
        }
      });
      return stored;
    }
    const initial: Record<string, RolePermissions> = {};
    SYSTEM_ROLES.forEach(r => {
      initial[r.key] = generateDefaultRolePermissions(r.key);
    });
    return initial;
  });

  // Dashboard widget configurations
  const [dashboardWidgetsByRole, setDashboardWidgetsByRole] = useState<Record<string, DashboardWidgetKey[]>>(() =>
    getStoredJSON(STORAGE_WIDGETS, DEFAULT_ROLE_WIDGETS)
  );

  // Logged in user - No auto login; require real authentication
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const savedUserId = localStorage.getItem(STORAGE_CURRENT_USER_ID);
    if (!savedUserId) {
      return null;
    }
    const storedUsers = getStoredJSON<UserAccount[]>(STORAGE_USERS, INITIAL_USER_ACCOUNTS);
    let user = storedUsers.find(u => u.id === savedUserId) || INITIAL_USER_ACCOUNTS.find(u => u.id === savedUserId) || null;
    if (user && user.id === 'usr-1' && (!user.avatar_url || user.avatar_url.includes('photo-1534528741775-53994a69daeb'))) {
      user = { ...user, avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250' };
    }
    return user;
  });

  // Impersonation state
  const [impersonatedUser, setImpersonatedUser] = useState<UserAccount | null>(null);

  // Activity & Login logs
  const [userActivityLogs, setUserActivityLogs] = useState<UserActivityLog[]>(() =>
    getStoredJSON(STORAGE_ACTIVITIES, INITIAL_USER_ACTIVITY_LOGS)
  );
  const [loginActivities, setLoginActivities] = useState<LoginActivity[]>(() =>
    getStoredJSON(STORAGE_LOGINS, INITIAL_LOGIN_ACTIVITIES)
  );

  // Sync to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_ROLES, JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PERMISSIONS, JSON.stringify(permissionsByRole));
  }, [permissionsByRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_WIDGETS, JSON.stringify(dashboardWidgetsByRole));
  }, [dashboardWidgetsByRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_ACTIVITIES, JSON.stringify(userActivityLogs));
  }, [userActivityLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_LOGINS, JSON.stringify(loginActivities));
  }, [loginActivities]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_CURRENT_USER_ID, currentUser.id);
    } else {
      localStorage.removeItem(STORAGE_CURRENT_USER_ID);
    }
  }, [currentUser]);

  // Effective user & role (considering impersonation)
  const effectiveUser = impersonatedUser || currentUser;
  const role: UserRole = effectiveUser ? effectiveUser.role_key : 'SUPER_ADMIN';
  const isClient = role === 'CLIENT';

  const logActivity = (action: string, module: string, description: string) => {
    const newLog: UserActivityLog = {
      id: 'act-' + Date.now(),
      user_id: effectiveUser?.id || 'unknown',
      user_name: effectiveUser?.full_name || 'System User',
      user_role: effectiveUser?.role_key || 'UNKNOWN',
      action,
      module,
      description,
      timestamp: new Date().toISOString(),
      ip_address: '127.0.0.1',
      device: navigator.userAgent.includes('Windows') ? 'Windows 11 / Chrome' : 'Desktop Browser'
    };
    setUserActivityLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const foundUser = users.find(u =>
      u.email.toLowerCase() === trimmedEmail ||
      (u.id === 'usr-1' && ['admin@digiscore.demo', 'hamid@digiscore.agency', 'admin@digiscore.agency'].includes(trimmedEmail))
    );

    if (!foundUser) {
      // Record failed login
      const failLog: LoginActivity = {
        id: 'log-' + Date.now(),
        user_id: 'unknown',
        user_name: 'Unregistered User',
        email: trimmedEmail,
        role: 'UNKNOWN',
        login_time: new Date().toISOString(),
        last_active: 'N/A',
        device: 'Web Client',
        status: 'Failed'
      };
      setLoginActivities(prev => [failLog, ...prev]);
      return { success: false, error: 'Invalid email or user account not found.' };
    }

    if (foundUser.status === 'Inactive' || foundUser.status === 'Suspended') {
      return { success: false, error: `Account is ${foundUser.status.toLowerCase()}. Please contact Super Admin.` };
    }

    // Optional check for password if provided
    if (password && foundUser.password && foundUser.password !== password) {
      return { success: false, error: 'Incorrect password entered.' };
    }

    // Update last login
    const updatedUser = { ...foundUser, last_login: 'Just now' };
    setUsers(prev => prev.map(u => u.id === foundUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    setImpersonatedUser(null);

    // Record login activity
    const successLog: LoginActivity = {
      id: 'log-' + Date.now(),
      user_id: foundUser.id,
      user_name: foundUser.full_name,
      email: foundUser.email,
      role: foundUser.role_key,
      login_time: new Date().toISOString(),
      last_active: 'Active now',
      device: 'Chrome on Windows 11',
      status: 'Success'
    };
    setLoginActivities(prev => [successLog, ...prev]);
    logActivity('User Login', 'Auth', `${foundUser.full_name} (${foundUser.role_key}) logged into DIGI SCORE OS.`);

    return { success: true };
  };

  const logout = async () => {
    if (currentUser) {
      logActivity('User Logout', 'Auth', `${currentUser.full_name} signed out.`);
    }
    setCurrentUser(null);
    setImpersonatedUser(null);
    localStorage.removeItem(STORAGE_CURRENT_USER_ID);

    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signout', e);
      }
    }
  };

  const startImpersonation = (targetUser: UserAccount) => {
    setImpersonatedUser(targetUser);
    logActivity('Started Impersonation', 'Security', `Super Admin started viewing system as ${targetUser.full_name} (${targetUser.role_key}).`);
  };

  const stopImpersonation = () => {
    if (impersonatedUser) {
      logActivity('Ended Impersonation', 'Security', `Exited preview mode for ${impersonatedUser.full_name}.`);
    }
    setImpersonatedUser(null);
  };

  // Permission Checker
  const hasPermission = (module: ModuleKey | string, action: PermissionAction = 'view'): boolean => {
    // If real Super Admin and NOT currently impersonating someone else
    if (!impersonatedUser && currentUser?.role_key === 'SUPER_ADMIN') {
      return true;
    }

    const currentRole = role;

    // Team Chat & Communication Hub is available for all staff and users
    if (module === 'communication' && (action === 'view' || action === 'create')) {
      return true;
    }

    // Check custom user override permissions first
    if (effectiveUser?.custom_permissions?.[module as ModuleKey]) {
      const userPerm = effectiveUser.custom_permissions[module as ModuleKey]?.[action];
      if (userPerm !== undefined) return userPerm;
    }

    // Role-based permissions
    const rolePerms = permissionsByRole[currentRole];
    if (rolePerms && rolePerms[module as ModuleKey]) {
      return rolePerms[module as ModuleKey][action] ?? false;
    }

    // Fallback logic for modules not in table or sub-modules
    if (currentRole === 'SUPER_ADMIN') return true;
    if (currentRole === 'ADMIN') return action !== 'delete' || !['settings', 'users'].includes(module);

    return false;
  };

  // Widget Checker
  const hasWidget = (widgetKey: DashboardWidgetKey): boolean => {
    if (!impersonatedUser && currentUser?.role_key === 'SUPER_ADMIN') {
      return true;
    }
    // Check user custom widgets
    if (effectiveUser?.custom_dashboard_widgets && effectiveUser.custom_dashboard_widgets.length > 0) {
      return effectiveUser.custom_dashboard_widgets.includes(widgetKey);
    }
    // Fall back to role widgets
    const roleWidgets = dashboardWidgetsByRole[role] || DEFAULT_ROLE_WIDGETS[role] || [];
    return roleWidgets.includes(widgetKey);
  };

  const getActiveWidgets = (): DashboardWidgetKey[] => {
    if (!impersonatedUser && currentUser?.role_key === 'SUPER_ADMIN') {
      return (
        dashboardWidgetsByRole.SUPER_ADMIN || [
          'revenue',
          'pending_payments',
          'expenses',
          'total_leads',
          'sales_pipeline',
          'active_clients',
          'my_projects',
          'my_tasks',
          'overdue_tasks',
          'content_calendar',
          'pending_approvals',
          'attendance',
          'notifications',
          'recent_activities'
        ]
      );
    }

    if (effectiveUser?.custom_dashboard_widgets && effectiveUser.custom_dashboard_widgets.length > 0) {
      return effectiveUser.custom_dashboard_widgets;
    }

    return dashboardWidgetsByRole[role] || DEFAULT_ROLE_WIDGETS[role] || [];
  };

  // User Management
  const createUser = (userData: Omit<UserAccount, 'id' | 'created_at' | 'last_login'>) => {
    const newUser: UserAccount = {
      ...userData,
      id: 'usr-' + Date.now(),
      created_at: new Date().toISOString().slice(0, 10),
      last_login: 'Never'
    };
    setUsers(prev => [newUser, ...prev]);
    logActivity('User Created', 'Users', `Created new user account for ${newUser.full_name} (${newUser.role_key}).`);
  };

  const updateUser = (id: string, updates: Partial<UserAccount>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
    if (currentUser?.id === id) {
      setCurrentUser(prev => (prev ? { ...prev, ...updates } : null));
    }
    if (impersonatedUser?.id === id) {
      setImpersonatedUser(prev => (prev ? { ...prev, ...updates } : null));
    }
    logActivity('User Updated', 'Users', `Updated account settings for user ID ${id}.`);
  };

  const updateUserProfilePhoto = (userId: string, newPhotoUrl: string) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, avatar_url: newPhotoUrl } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, avatar_url: newPhotoUrl } : null));
    }
    if (impersonatedUser?.id === userId) {
      setImpersonatedUser(prev => (prev ? { ...prev, avatar_url: newPhotoUrl } : null));
    }
    logActivity('Photo Updated', 'Profile', `Updated profile photo for user ID ${userId}.`);
  };

  const toggleUserStatus = (id: string, status: UserStatus) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, status } : u)));
    logActivity('User Status Changed', 'Users', `Updated user ID ${id} status to ${status}.`);
  };

  const deleteUser = (id: string) => {
    const target = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    logActivity('User Deleted', 'Users', `Deleted user account ${target?.full_name || id}.`);
  };

  const resetUserPassword = (id: string, newPassword?: string) => {
    const pass = newPassword || 'DigiScore@2026';
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, password: pass } : u)));
    logActivity('Password Reset', 'Users', `Password reset for user ID ${id}.`);
  };

  // Role Management
  const createCustomRole = (name: string, description: string, baseRole: UserRole = 'EMPLOYEE') => {
    const key = name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    const newRole: CustomRoleDefinition = {
      id: 'r-' + Date.now(),
      key,
      name,
      description,
      is_system: false,
      base_role: baseRole,
      created_at: new Date().toISOString().slice(0, 10)
    };
    setRoles(prev => [...prev, newRole]);

    // Copy base role permissions and widgets
    const basePerms = permissionsByRole[baseRole] || generateDefaultRolePermissions(baseRole);
    setPermissionsByRole(prev => ({ ...prev, [key]: JSON.parse(JSON.stringify(basePerms)) }));

    const baseWidgets = dashboardWidgetsByRole[baseRole] || DEFAULT_ROLE_WIDGETS[baseRole] || [];
    setDashboardWidgetsByRole(prev => ({ ...prev, [key]: [...baseWidgets] }));

    logActivity('Custom Role Created', 'Roles', `Created custom role "${name}" based on ${baseRole}.`);
  };

  const deleteCustomRole = (key: string) => {
    setRoles(prev => prev.filter(r => r.key !== key));
    setPermissionsByRole(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setDashboardWidgetsByRole(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    logActivity('Custom Role Deleted', 'Roles', `Deleted role ${key}.`);
  };

  const updateRolePermissions = (roleKey: string, permissions: RolePermissions) => {
    setPermissionsByRole(prev => ({ ...prev, [roleKey]: permissions }));
    logActivity('Role Permissions Saved', 'Permissions', `Updated permission matrix for role ${roleKey}.`);
  };

  const resetRolePermissions = (roleKey: string) => {
    const fresh = generateDefaultRolePermissions(roleKey);
    setPermissionsByRole(prev => ({ ...prev, [roleKey]: fresh }));
    logActivity('Role Permissions Reset', 'Permissions', `Reset permissions for role ${roleKey} to default.`);
  };

  const updateDashboardWidgets = (roleKey: string, widgets: DashboardWidgetKey[]) => {
    setDashboardWidgetsByRole(prev => ({ ...prev, [roleKey]: widgets }));
    logActivity('Dashboard Widgets Configured', 'Dashboard Builder', `Configured ${widgets.length} widgets for role ${roleKey}.`);
  };

  const updateUserCustomWidgets = (userId: string, widgets: DashboardWidgetKey[]) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, custom_dashboard_widgets: widgets } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, custom_dashboard_widgets: widgets } : null));
    }
    logActivity('User Widgets Configured', 'Dashboard Builder', `Configured custom dashboard widgets for user ID ${userId}.`);
  };

  const switchPersona = (roleKey: UserRole) => {
    const found = users.find(u => u.role_key === roleKey);
    if (found) {
      setCurrentUser(found);
      setImpersonatedUser(null);
      logActivity('Switched Persona', 'Auth', `Switched active user to ${found.full_name} (${found.role_key}).`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: effectiveUser,
        user: effectiveUser,
        role,
        isAuthenticated: !!currentUser,
        isClient,
        login,
        logout,
        switchRole: switchPersona,
        isImpersonating: !!impersonatedUser,
        impersonatedUser,
        startImpersonation,
        stopImpersonation,
        hasPermission,
        hasWidget,
        getActiveWidgets,
        users,
        createUser,
        updateUser,
        updateUserProfilePhoto,
        toggleUserStatus,
        deleteUser,
        resetUserPassword,
        roles,
        createCustomRole,
        deleteCustomRole,
        permissionsByRole,
        updateRolePermissions,
        resetRolePermissions,
        dashboardWidgetsByRole,
        updateDashboardWidgets,
        updateUserCustomWidgets,
        userActivityLogs,
        loginActivities,
        logActivity,
        switchPersona
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
