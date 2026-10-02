import React, { useState } from 'react';
import {
  Users,
  Shield,
  Sliders,
  Eye,
  Key,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  History,
  Lock,
  UserCheck,
  Search,
  Filter,
  Save,
  RotateCcw,
  Sparkles,
  Laptop,
  Check,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import {
  UserAccount,
  UserStatus,
  UserRole,
  ModuleKey,
  PermissionAction,
  DashboardWidgetKey,
  RolePermissions
} from '../../../types';
import { ALL_MODULES, ALL_ACTIONS, ALL_WIDGETS, SYSTEM_ROLES } from '../../../data/rbacData';
import { Modal } from '../../common/Modal';
import { formatDate, formatDateTime } from '../../../lib/utils';

export const UserManagementModule: React.FC = () => {
  const {
    currentUser,
    users,
    createUser,
    updateUser,
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
    startImpersonation,
    userActivityLogs,
    loginActivities
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions' | 'dashboard_builder' | 'activity_logs' | 'login_activity'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Create / Edit User Modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userFormData, setUserFormData] = useState({
    full_name: '',
    email: '',
    password: 'password123',
    phone: '',
    role_key: 'EMPLOYEE' as UserRole,
    department: 'Creative & Design',
    designation: '',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    status: 'Active' as UserStatus,
    joining_date: new Date().toISOString().slice(0, 10)
  });

  // Create Custom Role Modal
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [customRoleForm, setCustomRoleForm] = useState({
    name: '',
    description: '',
    baseRole: 'EMPLOYEE' as UserRole
  });

  // Selected role for Permission Matrix
  const [selectedPermRole, setSelectedPermRole] = useState<string>('DESIGNER');
  const [tempPermissions, setTempPermissions] = useState<RolePermissions | null>(null);
  const [permSuccess, setPermSuccess] = useState(false);

  // Selected role or user for Dashboard Builder
  const [builderTargetType, setBuilderTargetType] = useState<'role' | 'user'>('role');
  const [selectedBuilderRole, setSelectedBuilderRole] = useState<string>('DESIGNER');
  const [selectedBuilderUserId, setSelectedBuilderUserId] = useState<string>(users[0]?.id || '');
  const [tempWidgets, setTempWidgets] = useState<DashboardWidgetKey[]>([]);
  const [builderSuccess, setBuilderSuccess] = useState(false);

  // Reset Password Modal
  const [resetPassUser, setResetPassUser] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState('DigiScore@2026');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Initialize permission matrix for selected role
  React.useEffect(() => {
    if (permissionsByRole[selectedPermRole]) {
      setTempPermissions(JSON.parse(JSON.stringify(permissionsByRole[selectedPermRole])));
    }
  }, [selectedPermRole, permissionsByRole]);

  // Initialize widgets for selected builder target
  React.useEffect(() => {
    if (builderTargetType === 'role') {
      const current = dashboardWidgetsByRole[selectedBuilderRole] || [];
      setTempWidgets([...current]);
    } else {
      const u = users.find(x => x.id === selectedBuilderUserId);
      if (u?.custom_dashboard_widgets && u.custom_dashboard_widgets.length > 0) {
        setTempWidgets([...u.custom_dashboard_widgets]);
      } else if (u) {
        const roleDefs = dashboardWidgetsByRole[u.role_key] || [];
        setTempWidgets([...roleDefs]);
      }
    }
  }, [builderTargetType, selectedBuilderRole, selectedBuilderUserId, dashboardWidgetsByRole, users]);

  // Open Create User Modal
  const handleOpenCreateUser = () => {
    setEditingUserId(null);
    setUserFormData({
      full_name: '',
      email: '',
      password: 'password123',
      phone: '',
      role_key: 'EMPLOYEE',
      department: 'Creative & Design',
      designation: '',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      status: 'Active',
      joining_date: new Date().toISOString().slice(0, 10)
    });
    setIsUserModalOpen(true);
  };

  // Open Edit User Modal
  const handleOpenEditUser = (user: UserAccount) => {
    setEditingUserId(user.id);
    setUserFormData({
      full_name: user.full_name,
      email: user.email,
      password: user.password || 'password123',
      phone: user.phone || '',
      role_key: user.role_key,
      department: user.department || 'Creative & Design',
      designation: user.designation || '',
      avatar_url: user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      status: user.status,
      joining_date: user.joining_date || new Date().toISOString().slice(0, 10)
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId) {
      updateUser(editingUserId, userFormData);
    } else {
      createUser(userFormData);
    }
    setIsUserModalOpen(false);
  };

  const handleCreateCustomRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoleForm.name) return;
    createCustomRole(customRoleForm.name, customRoleForm.description, customRoleForm.baseRole);
    setIsRoleModalOpen(false);
    setCustomRoleForm({ name: '', description: '', baseRole: 'EMPLOYEE' });
  };

  const handleTogglePermission = (mod: ModuleKey, act: PermissionAction) => {
    if (!tempPermissions) return;
    setTempPermissions({
      ...tempPermissions,
      [mod]: {
        ...tempPermissions[mod],
        [act]: !tempPermissions[mod]?.[act]
      }
    });
  };

  const handleSavePermissions = () => {
    if (tempPermissions) {
      updateRolePermissions(selectedPermRole, tempPermissions);
      setPermSuccess(true);
      setTimeout(() => setPermSuccess(false), 2500);
    }
  };

  const handleResetPermissions = () => {
    resetRolePermissions(selectedPermRole);
  };

  const handleToggleWidget = (widgetKey: DashboardWidgetKey) => {
    if (tempWidgets.includes(widgetKey)) {
      setTempWidgets(tempWidgets.filter(w => w !== widgetKey));
    } else {
      setTempWidgets([...tempWidgets, widgetKey]);
    }
  };

  const handleSaveDashboardWidgets = () => {
    if (builderTargetType === 'role') {
      updateDashboardWidgets(selectedBuilderRole, tempWidgets);
    } else {
      updateUserCustomWidgets(selectedBuilderUserId, tempWidgets);
    }
    setBuilderSuccess(true);
    setTimeout(() => setBuilderSuccess(false), 2500);
  };

  const handleConfirmResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPassUser) return;
    resetUserPassword(resetPassUser.id, newPassword);
    setResetSuccess(true);
    setTimeout(() => {
      setResetPassUser(null);
      setResetSuccess(false);
    }, 1800);
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || u.role_key === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-fuchsia-400" />
            Multi-User RBAC & Access Control
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage agency accounts, role permissions, custom roles, dashboard configurations, and audit trails.
          </p>
        </div>

        <button
          onClick={handleOpenCreateUser}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 hover:opacity-95 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New User</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="p-1.5 rounded-2xl glass-panel border border-slate-800 flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'users' ? 'bg-fuchsia-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Accounts ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'roles' ? 'bg-fuchsia-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Role Management ({roles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'permissions' ? 'bg-fuchsia-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Permission Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard_builder')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'dashboard_builder' ? 'bg-fuchsia-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Dashboard Widget Builder</span>
        </button>

        <button
          onClick={() => setActiveTab('activity_logs')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'activity_logs' ? 'bg-fuchsia-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>User Activity Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('login_activity')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'login_activity' ? 'bg-fuchsia-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Login History</span>
        </button>
      </div>

      {/* TAB 1: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl glass-panel border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, department..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> Role:
              </span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                <option value="ALL">All Roles ({users.length})</option>
                {roles.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 font-bold">User Details</th>
                    <th className="py-3 px-4 font-bold">Role</th>
                    <th className="py-3 px-4 font-bold">Department</th>
                    <th className="py-3 px-4 font-bold">Phone</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Last Login</th>
                    <th className="py-3 px-4 font-bold">Joined</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                            alt={u.full_name}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-purple-500/30 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate">{u.full_name}</p>
                            <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {u.role_key}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-300">{u.department || 'General'}</td>
                      <td className="py-3 px-4 text-slate-300">{u.phone || 'N/A'}</td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleUserStatus(u.id, u.status === 'Active' ? 'Suspended' : 'Active')}
                          title="Click to toggle status"
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                            u.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              : u.status === 'Suspended'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                              : 'bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-700'
                          }`}
                        >
                          {u.status}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-slate-400">{u.last_login || 'Never'}</td>
                      <td className="py-3 px-4 text-slate-400">{formatDate(u.joining_date || u.created_at)}</td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Impersonate button */}
                          <button
                            onClick={() => startImpersonation(u)}
                            title={`Preview system as ${u.full_name}`}
                            className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Reset password button */}
                          <button
                            onClick={() => {
                              setResetPassUser(u);
                              setNewPassword('DigiScore@2026');
                            }}
                            title="Reset Password"
                            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => handleOpenEditUser(u)}
                            title="Edit User"
                            className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete button (cannot delete own account) */}
                          {u.id !== currentUser?.id && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete user ${u.full_name}?`)) {
                                  deleteUser(u.id);
                                }
                              }}
                              title="Delete User"
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES & CUSTOM ROLES */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">System & Custom Roles</h3>
              <p className="text-xs text-slate-400">Create granular custom roles like "Senior Designer", "Sales Manager", etc.</p>
            </div>
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-purple-500"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create Custom Role</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((r) => {
              const usersInRole = users.filter((u) => u.role_key === r.key).length;
              return (
                <div key={r.id} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3 relative group">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{r.name}</h4>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          r.is_system ? 'bg-blue-500/20 text-blue-300' : 'bg-fuchsia-500/20 text-fuchsia-300'
                        }`}>
                          {r.is_system ? 'System' : 'Custom'}
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-400 font-mono mt-0.5">{r.key}</p>
                    </div>

                    {!r.is_system && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete custom role ${r.name}?`)) {
                            deleteCustomRole(r.key);
                          }
                        }}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Delete Role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">{r.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">Assigned Users: <strong className="text-white">{usersInRole}</strong></span>
                    <button
                      onClick={() => {
                        setSelectedPermRole(r.key);
                        setActiveTab('permissions');
                      }}
                      className="text-fuchsia-400 hover:underline font-semibold"
                    >
                      Configure Permissions →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PERMISSION MATRIX */}
      {activeTab === 'permissions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-300">Select Role to Configure:</span>
              <select
                value={selectedPermRole}
                onChange={(e) => setSelectedPermRole(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {roles.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.name} ({r.key})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              {permSuccess && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Saved Successfully!
                </span>
              )}
              <button
                onClick={handleResetPermissions}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
              <button
                onClick={handleSavePermissions}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow hover:opacity-95 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Permissions</span>
              </button>
            </div>
          </div>

          {/* Matrix Grid */}
          <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 font-bold">Module</th>
                    <th className="py-3 px-4 font-bold">Category</th>
                    {ALL_ACTIONS.map((a) => (
                      <th key={a.key} className="py-3 px-4 font-bold text-center">
                        {a.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {ALL_MODULES.map((m) => {
                    const rowPerms = tempPermissions?.[m.key] || {
                      view: false,
                      create: false,
                      edit: false,
                      delete: false,
                      approve: false,
                      export: false
                    };

                    return (
                      <tr key={m.key} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">{m.label}</td>
                        <td className="py-3 px-4 text-slate-400">{m.group}</td>

                        {ALL_ACTIONS.map((act) => {
                          const isChecked = !!rowPerms[act.key];
                          return (
                            <td key={act.key} className="py-3 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleTogglePermission(m.key, act.key)}
                                className="w-4 h-4 rounded text-fuchsia-600 bg-slate-900 border-slate-700 focus:ring-fuchsia-500 cursor-pointer accent-fuchsia-600"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DASHBOARD WIDGET BUILDER */}
      {activeTab === 'dashboard_builder' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  onClick={() => setBuilderTargetType('role')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    builderTargetType === 'role' ? 'bg-fuchsia-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Configure by Role
                </button>
                <button
                  onClick={() => setBuilderTargetType('user')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    builderTargetType === 'user' ? 'bg-fuchsia-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Configure by Specific User
                </button>
              </div>

              {builderTargetType === 'role' ? (
                <select
                  value={selectedBuilderRole}
                  onChange={(e) => setSelectedBuilderRole(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
                >
                  {roles.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.name}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={selectedBuilderUserId}
                  onChange={(e) => setSelectedBuilderUserId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name} ({u.role_key})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center gap-3">
              {builderSuccess && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Dashboard Widgets Saved!
                </span>
              )}
              <button
                onClick={handleSaveDashboardWidgets}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow hover:opacity-95 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Dashboard Configuration</span>
              </button>
            </div>
          </div>

          {/* Widget Grid Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {ALL_WIDGETS.map((w) => {
              const isSelected = tempWidgets.includes(w.key);
              return (
                <div
                  key={w.key}
                  onClick={() => handleToggleWidget(w.key)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isSelected
                      ? 'bg-fuchsia-950/20 border-fuchsia-500/50 shadow-md shadow-fuchsia-500/10'
                      : 'glass-panel border-slate-800 hover:border-slate-700 opacity-60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 mt-0.5 rounded text-fuchsia-600 bg-slate-900 border-slate-700 focus:ring-fuchsia-500 accent-fuchsia-600 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-white truncate">{w.label}</p>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-semibold">
                        {w.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{w.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: USER ACTIVITY LOGS */}
      {activeTab === 'activity_logs' && (
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">System Activity & Audit Trail</h3>
            <span className="text-xs text-slate-400">Total Events: {userActivityLogs.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-bold">User</th>
                  <th className="py-3 px-4 font-bold">Action</th>
                  <th className="py-3 px-4 font-bold">Module</th>
                  <th className="py-3 px-4 font-bold">Details</th>
                  <th className="py-3 px-4 font-bold">Device / IP</th>
                  <th className="py-3 px-4 font-bold text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {userActivityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-white">{log.user_name}</p>
                      <span className="text-[10px] text-fuchsia-400">{log.user_role}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-400">{log.action}</td>
                    <td className="py-3 px-4 text-purple-300">{log.module}</td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs">{log.description}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{log.device || log.ip_address}</td>
                    <td className="py-3 px-4 text-right text-slate-400">{formatDateTime(log.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: LOGIN ACTIVITY */}
      {activeTab === 'login_activity' && (
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Login & Session Security Log</h3>
            <span className="text-xs text-slate-400">Total Logins Recorded: {loginActivities.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-bold">User</th>
                  <th className="py-3 px-4 font-bold">Email</th>
                  <th className="py-3 px-4 font-bold">Role</th>
                  <th className="py-3 px-4 font-bold">Device</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Last Active</th>
                  <th className="py-3 px-4 font-bold text-right">Login Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loginActivities.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-white">{l.user_name}</td>
                    <td className="py-3 px-4 text-slate-400">{l.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-purple-300">
                        {l.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{l.device}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        l.status === 'Success'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{l.last_active}</td>
                    <td className="py-3 px-4 text-right text-slate-400">{formatDateTime(l.login_time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT USER MODAL */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={editingUserId ? 'Edit User Account' : 'Create New User Account'}
        subtitle="Configure profile, designation and access credentials"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={userFormData.full_name}
                onChange={(e) => setUserFormData({ ...userFormData, full_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email *</label>
              <input
                type="email"
                required
                value={userFormData.email}
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={userFormData.phone}
                onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                placeholder="+91 98470 12345"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={userFormData.password}
                onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role *</label>
              <select
                value={userFormData.role_key}
                onChange={(e) => setUserFormData({ ...userFormData, role_key: e.target.value as UserRole })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {roles.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
              <input
                type="text"
                value={userFormData.department}
                onChange={(e) => setUserFormData({ ...userFormData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Designation</label>
              <input
                type="text"
                value={userFormData.designation}
                onChange={(e) => setUserFormData({ ...userFormData, designation: e.target.value })}
                placeholder="Senior Motion Designer"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Account Status</label>
              <select
                value={userFormData.status}
                onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value as UserStatus })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Photo URL</label>
            <input
              type="url"
              value={userFormData.avatar_url}
              onChange={(e) => setUserFormData({ ...userFormData, avatar_url: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsUserModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow"
            >
              {editingUserId ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CREATE CUSTOM ROLE MODAL */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Create Custom Role"
        subtitle="Define a specialized permission persona"
        maxWidth="md"
      >
        <form onSubmit={handleCreateCustomRoleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Role Title *</label>
            <input
              type="text"
              required
              value={customRoleForm.name}
              onChange={(e) => setCustomRoleForm({ ...customRoleForm, name: e.target.value })}
              placeholder="e.g. Senior Brand Designer"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={customRoleForm.description}
              onChange={(e) => setCustomRoleForm({ ...customRoleForm, description: e.target.value })}
              placeholder="Responsibilities and permission scope..."
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Clone Base Role Permissions From</label>
            <select
              value={customRoleForm.baseRole}
              onChange={(e) => setCustomRoleForm({ ...customRoleForm, baseRole: e.target.value as UserRole })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            >
              {SYSTEM_ROLES.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow"
            >
              Create Role
            </button>
          </div>
        </form>
      </Modal>

      {/* RESET PASSWORD MODAL */}
      {resetPassUser && (
        <Modal
          isOpen={true}
          onClose={() => setResetPassUser(null)}
          title={`Reset Password: ${resetPassUser.full_name}`}
          subtitle={`Set a temporary or new password for ${resetPassUser.email}`}
          maxWidth="sm"
        >
          <form onSubmit={handleConfirmResetPassword} className="space-y-4">
            {resetSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Password has been successfully updated!</span>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetPassUser(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow"
                  >
                    Set Password
                  </button>
                </div>
              </>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
};
