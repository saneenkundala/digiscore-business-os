import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  Target,
  Clock,
  Briefcase,
  Kanban,
  Building2,
  Receipt,
  FileSpreadsheet,
  CreditCard,
  FolderGit2,
  CheckSquare,
  Calendar,
  Sparkles,
  CalendarRange,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ReceiptText,
  PieChart,
  UserCheck,
  CalendarCheck,
  PlaneTakeoff,
  Banknote,
  FileText,
  BarChart3,
  Settings,
  MessageSquare,
  Bell,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  LogOut,
  ExternalLink,
  ChevronLeft,
  Key
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { cn } from '../../lib/utils';
import { UserProfileModal } from '../common/UserProfileModal';

interface SidebarProps {
  currentModule: string;
  onNavigate: (module: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  permModule?: string;
  children?: { id: string; label: string; icon: React.ReactNode; permModule?: string }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  const { role, currentUser, isClient, hasPermission, permissionsByRole, isImpersonating, impersonatedUser, logout } = useAuth();
  const { totalUnreadChatCount } = useData();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    crm: true,
    sales: true,
    projects: true,
    content: true,
    finance: true,
    hr: true,
    clients: true
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Full Nav Structure
  const rawNavGroups: NavGroup[] = isClient
    ? [
        { id: 'portal', label: 'Client Portal', icon: <Sparkles className="w-5 h-5 text-fuchsia-400" /> },
        { id: 'projects', label: 'Our Projects', icon: <FolderGit2 className="w-5 h-5 text-indigo-400" /> },
        { id: 'content', label: 'Content Approvals', icon: <CheckCircle2 className="w-5 h-5 text-pink-400" /> },
        { id: 'invoices', label: 'Billing & Invoices', icon: <Receipt className="w-5 h-5 text-emerald-400" /> },
        { id: 'documents', label: 'Brand Assets & Docs', icon: <FileText className="w-5 h-5 text-blue-400" /> }
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, permModule: 'dashboard' },
        {
          id: 'crm',
          label: 'CRM',
          icon: <Target className="w-5 h-5" />,
          permModule: 'crm',
          children: [
            { id: 'crm-leads', label: 'Leads', icon: <Users className="w-4 h-4" />, permModule: 'leads' },
            { id: 'crm-followups', label: 'Follow-ups', icon: <Clock className="w-4 h-4" />, permModule: 'followups' },
            { id: 'crm-deals', label: 'Deals', icon: <Briefcase className="w-4 h-4" />, permModule: 'deals' },
            { id: 'crm-pipeline', label: 'Pipeline', icon: <Kanban className="w-4 h-4" />, permModule: 'pipeline' }
          ]
        },
        {
          id: 'clients',
          label: 'Clients',
          icon: <Building2 className="w-5 h-5" />,
          permModule: 'clients',
          children: [
            { id: 'clients-all', label: 'All Clients', icon: <Users className="w-4 h-4" />, permModule: 'clients' },
            { id: 'clients-companies', label: 'Companies', icon: <Building2 className="w-4 h-4" />, permModule: 'companies' }
          ]
        },
        {
          id: 'sales',
          label: 'Sales',
          icon: <DollarSign className="w-5 h-5" />,
          permModule: 'sales',
          children: [
            { id: 'sales-quotations', label: 'Quotations', icon: <FileSpreadsheet className="w-4 h-4" />, permModule: 'quotations' },
            { id: 'sales-invoices', label: 'Invoices', icon: <Receipt className="w-4 h-4" />, permModule: 'invoices' },
            { id: 'sales-payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" />, permModule: 'payments' }
          ]
        },
        {
          id: 'projects',
          label: 'Projects',
          icon: <FolderGit2 className="w-5 h-5" />,
          permModule: 'projects',
          children: [
            { id: 'projects-list', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" />, permModule: 'projects' },
            { id: 'projects-tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" />, permModule: 'tasks' },
            { id: 'projects-calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" />, permModule: 'projects' }
          ]
        },
        {
          id: 'content',
          label: 'Content',
          icon: <Sparkles className="w-5 h-5" />,
          permModule: 'content',
          children: [
            { id: 'content-calendar', label: 'Content Calendar', icon: <CalendarRange className="w-4 h-4" />, permModule: 'content' },
            { id: 'content-list', label: 'Content', icon: <Sparkles className="w-4 h-4" />, permModule: 'content' },
            { id: 'content-approvals', label: 'Approvals', icon: <CheckCircle2 className="w-4 h-4" />, permModule: 'content_approval' }
          ]
        },
        {
          id: 'finance',
          label: 'Finance',
          icon: <TrendingUp className="w-5 h-5" />,
          permModule: 'finance',
          children: [
            { id: 'finance-revenue', label: 'Revenue', icon: <DollarSign className="w-4 h-4" />, permModule: 'finance' },
            { id: 'finance-expenses', label: 'Expenses', icon: <ReceiptText className="w-4 h-4" />, permModule: 'expenses' },
            { id: 'finance-pnl', label: 'Profit & Loss', icon: <PieChart className="w-4 h-4" />, permModule: 'finance' }
          ]
        },
        {
          id: 'hr',
          label: 'HR',
          icon: <UserCheck className="w-5 h-5" />,
          permModule: 'hr',
          children: [
            { id: 'hr-employees', label: 'Employees', icon: <Users className="w-4 h-4" />, permModule: 'employees' },
            { id: 'hr-attendance', label: 'Attendance', icon: <CalendarCheck className="w-4 h-4" />, permModule: 'attendance' },
            { id: 'hr-leave', label: 'Leave', icon: <PlaneTakeoff className="w-4 h-4" />, permModule: 'leave' },
            { id: 'hr-salary', label: 'Salary', icon: <Banknote className="w-4 h-4" />, permModule: 'salary' }
          ]
        },
        { id: 'documents', label: 'Documents', icon: <FileText className="w-5 h-5" />, permModule: 'documents' },
        { id: 'communication', label: 'Team Chat & Comms', icon: <MessageSquare className="w-5 h-5" />, permModule: 'communication' },
        { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" />, permModule: 'reports' },
        { id: 'users', label: 'Users & RBAC', icon: <Key className="w-5 h-5" />, permModule: 'users' },
        { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, permModule: 'notifications' },
        { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, permModule: 'settings' }
      ];

  // Dynamically filter nav items according to RBAC permissions!
  const navGroups: NavGroup[] = useMemo(() => {
    if (isClient) return rawNavGroups;

    return rawNavGroups
      .map((group) => {
        // Group with sub-modules (CRM, Clients, Sales, Projects, Content, Finance, HR)
        if (group.children && group.children.length > 0) {
          const allowedChildren = group.children.filter((child) =>
            hasPermission(child.permModule || group.permModule!, 'view')
          );

          // If no sub-modules are permitted, completely omit this group!
          if (allowedChildren.length === 0) {
            return null;
          }

          return {
            ...group,
            children: allowedChildren
          };
        }

        // Single module without sub-items (Dashboard, Documents, Communication, Reports, Users & RBAC, Notifications, Settings)
        if (group.permModule && !hasPermission(group.permModule, 'view')) {
          return null;
        }

        return group;
      })
      .filter((g): g is NavGroup => g !== null);
  }, [role, currentUser, isClient, permissionsByRole, isImpersonating, impersonatedUser]);

  const handleItemClick = (id: string) => {
    onNavigate(id);
    if (isMobileOpen) onCloseMobile();
  };

  const handleGroupClick = (group: NavGroup) => {
    const targetModule = group.children && group.children.length > 0 ? group.children[0].id : group.id;
    // Always expand the submenu so its children are visible
    setExpandedGroups(prev => ({ ...prev, [group.id]: true }));
    handleItemClick(targetModule);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-slate-950 border-r border-slate-800/80 transition-all duration-300 select-none shadow-2xl',
          isCollapsed ? 'w-20' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo & Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/50">
          <div
            onClick={() => handleItemClick('dashboard')}
            className={cn(
              'flex items-center gap-3 cursor-pointer overflow-hidden transition-all',
              isCollapsed && 'justify-center w-full'
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-600/30 shrink-0">
              D
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-lg tracking-wider text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-fuchsia-200">
                  DIGI SCORE
                </span>
                <span className="text-[10px] text-fuchsia-400 font-semibold tracking-widest uppercase">
                  Business OS
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Client Portal Mode pill for Client */}
        {isClient && !isCollapsed && (
          <div className="px-3 pt-3 pb-1">
            <div className="flex items-center gap-2 p-2.5 rounded-xl border border-fuchsia-500/40 bg-fuchsia-950/20 text-fuchsia-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
              <span>Isolated Client Portal</span>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navGroups.map((group) => {
            const hasChildren = group.children && group.children.length > 0;
            const isGroupActive =
              currentModule === group.id ||
              (hasChildren && group.children?.some(c => c.id === currentModule));
            const isExpanded = expandedGroups[group.id];

            if (!hasChildren) {
              return (
                <button
                  key={group.id}
                  onClick={() => handleItemClick(group.id)}
                  title={isCollapsed ? group.label : undefined}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                    currentModule === group.id
                      ? 'bg-gradient-to-r from-purple-600/90 to-fuchsia-600/90 text-white shadow-md shadow-purple-600/20 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80',
                    isCollapsed && 'justify-center px-0'
                  )}
                >
                  <span className={cn('shrink-0 transition-transform group-hover:scale-110')}>
                    {group.icon}
                  </span>
                  {!isCollapsed && (
                    <div className="flex items-center justify-between w-full min-w-0">
                      <span className="truncate">{group.label}</span>
                      {group.id === 'communication' && totalUnreadChatCount > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500 text-white shrink-0 animate-pulse shadow-sm shadow-pink-500/50">
                          {totalUnreadChatCount}
                        </span>
                      )}
                    </div>
                  )}
                  {isCollapsed && group.id === 'communication' && totalUnreadChatCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-pink-500 ring-2 ring-slate-950 animate-pulse" />
                  )}
                </button>
              );
            }

            return (
              <div key={group.id} className="space-y-1">
                <div
                  onClick={() => handleGroupClick(group)}
                  title={isCollapsed ? group.label : undefined}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group cursor-pointer select-none',
                    isGroupActive
                      ? 'text-fuchsia-300 bg-fuchsia-950/30 font-semibold border border-fuchsia-500/20 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80',
                    isCollapsed && 'justify-center px-0'
                  )}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className={cn('shrink-0 group-hover:scale-110 transition-transform', isGroupActive && 'text-fuchsia-400')}>
                      {group.icon}
                    </span>
                    {!isCollapsed && <span className="truncate">{group.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGroup(group.id);
                      }}
                      className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                      title={isExpanded ? 'Collapse section' : 'Expand section'}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Submenu */}
                {!isCollapsed && isExpanded && (
                  <div className="pl-6 pr-1 space-y-1 border-l border-slate-800/80 ml-5 my-1">
                    {group.children?.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => handleItemClick(child.id)}
                        className={cn(
                          'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                          currentModule === child.id
                            ? 'bg-fuchsia-600/20 text-fuchsia-300 font-semibold border-l-2 border-fuchsia-500'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                        )}
                      >
                        <span className="shrink-0">{child.icon}</span>
                        <span className="truncate">{child.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer / User Profile & Sign Out */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <div
            className={cn(
              'flex items-center justify-between p-2 rounded-xl bg-slate-900/70 border border-slate-800/80',
              isCollapsed && 'justify-center p-1'
            )}
          >
            <div
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-80 transition-opacity flex-1"
              title="View Profile Details"
            >
              <img
                src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250'}
                alt={currentUser?.full_name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-purple-500/40 shrink-0"
              />
              {!isCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-white truncate">{currentUser?.full_name}</span>
                  <span className="text-[10px] text-fuchsia-400 font-semibold truncate uppercase">{role}</span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={logout}
      />
    </>
  );
};
