import React, { useState } from 'react';
import {
  Menu,
  Search,
  Plus,
  Bell,
  Database,
  Check,
  ChevronDown,
  Sparkles,
  Users,
  CheckSquare,
  FileSpreadsheet,
  ReceiptText,
  RotateCcw,
  Eye,
  LogOut,
  User,
  Clock,
  Building2,
  Home,
  MessageSquare,
  Download,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { SupabaseSyncModal } from '../common/SupabaseSyncModal';
import { UserProfileModal } from '../common/UserProfileModal';
import { PlatformInstallModal } from '../common/PlatformInstallModal';
import { formatDate } from '../../lib/utils';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onOpenQuickAdd: (type: 'lead' | 'task' | 'content' | 'invoice' | 'expense') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigate?: (module: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  onOpenQuickAdd,
  searchQuery,
  onSearchChange,
  onNavigate
}) => {
  const {
    currentUser,
    role,
    users,
    startImpersonation,
    stopImpersonation,
    isImpersonating,
    impersonatedUser,
    hasPermission,
    logout
  } = useAuth();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    getStaffTodayAttendance,
    punchIn,
    punchOut,
    totalUnreadChatCount
  } = useData();

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isImpersonateMenuOpen, setIsImpersonateMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const staffToday = role !== 'CLIENT' && currentUser
    ? getStaffTodayAttendance(currentUser.id, currentUser.full_name)
    : undefined;

  const isAdmin = currentUser?.role_key === 'SUPER_ADMIN' || currentUser?.role_key === 'ADMIN';

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads, clients, projects, tasks, invoices..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500/60 focus:ring-1 focus:ring-fuchsia-500/40 transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Supabase Status Pill - Admin Only */}
          {isAdmin && (
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isSupabaseConfigured
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured ? 'Supabase Live' : 'Local DB Engine'}</span>
            </button>
          )}

          {/* Quick Action Button (shown only if user has creation rights) */}
          <div className="relative">
            <button
              onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-95 shadow-md shadow-purple-600/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isQuickAddOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl glass-panel bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={() => setIsQuickAddOpen(false)}
              >
                {hasPermission('leads', 'create') && (
                  <button
                    onClick={() => onOpenQuickAdd('lead')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <Users className="w-4 h-4 text-pink-400" />
                    <span>New Lead</span>
                  </button>
                )}
                {hasPermission('tasks', 'create') && (
                  <button
                    onClick={() => onOpenQuickAdd('task')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <CheckSquare className="w-4 h-4 text-purple-400" />
                    <span>New Task</span>
                  </button>
                )}
                {hasPermission('content', 'create') && (
                  <button
                    onClick={() => onOpenQuickAdd('content')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <Sparkles className="w-4 h-4 text-fuchsia-400" />
                    <span>New Content Item</span>
                  </button>
                )}
                {hasPermission('invoices', 'create') && (
                  <button
                    onClick={() => onOpenQuickAdd('invoice')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>New Invoice</span>
                  </button>
                )}
                {hasPermission('expenses', 'create') && (
                  <button
                    onClick={() => onOpenQuickAdd('expense')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <ReceiptText className="w-4 h-4 text-amber-400" />
                    <span>Record Expense</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Super Admin "View as User" Impersonation Switcher - Admin Only */}
          {isAdmin && (
            <div className="relative">
              <button
                onClick={() => setIsImpersonateMenuOpen(!isImpersonateMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-xs font-medium text-slate-300 hover:border-purple-500/40 transition-colors"
                title="Test system as other users"
              >
                <Eye className="w-3.5 h-3.5 text-fuchsia-400" />
                <span className="hidden sm:inline font-semibold">
                  {isImpersonating ? `Viewing: ${impersonatedUser?.full_name}` : `Role: ${role}`}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isImpersonateMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in"
                  onClick={() => setIsImpersonateMenuOpen(false)}
                >
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Impersonate User Perspective</span>
                    {isImpersonating && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          stopImpersonation();
                        }}
                        className="text-amber-400 hover:underline"
                      >
                        Exit Preview
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 mt-1">
                    {users.map((u) => {
                      const isSelected = (impersonatedUser?.id || currentUser?.id) === u.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => startImpersonation(u)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                            isSelected
                              ? 'bg-fuchsia-600/20 text-fuchsia-300 font-bold'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <img
                              src={u.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250'}
                              alt={u.full_name}
                              className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-700 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-white">{u.full_name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{u.role_key} • {u.department || 'General'}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-fuchsia-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Staff Attendance Punch Button */}
          {role !== 'CLIENT' && currentUser && (
            <div className="hidden sm:flex items-center">
              {!staffToday?.punch_in ? (
                <button
                  type="button"
                  onClick={() => {
                    punchIn(currentUser.id, currentUser.full_name, 'Office');
                    try {
                      confetti({ particleCount: 70, spread: 60, origin: { y: 0.2 } });
                    } catch {
                      // Fallback
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/25 transition-all shadow-sm shadow-emerald-500/10 cursor-pointer"
                  title="Quick Punch In (Office)"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Punch In</span>
                </button>
              ) : !staffToday?.punch_out ? (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Punch Out now, ${currentUser.full_name}?`)) {
                      punchOut(currentUser.id, currentUser.full_name);
                    }
                  }}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-emerald-500/40 text-emerald-300 hover:border-rose-500/60 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
                  title="Click to Punch Out"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:bg-rose-400 animate-pulse" />
                  <span className="group-hover:hidden">In: {staffToday.punch_in}</span>
                  <span className="hidden group-hover:inline font-bold">Punch Out ⏹️</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400">
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span>Shift {staffToday.total_hours}h</span>
                </span>
              )}
            </div>
          )}

          {/* Cross-Platform App Install (Windows, Mac, iPhone, Android) - Admin Only */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsInstallModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-white text-xs font-semibold transition-all shadow-sm group"
              title="Install App on Windows, iPhone, Mac, or Android"
            >
              <Download className="w-3.5 h-3.5 text-purple-400 group-hover:animate-bounce" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {/* Team Chat Quick Shortcut */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('communication')}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Team Chat & Messenger (സ്റ്റാഫ് ചാറ്റ്)"
          >
            <MessageSquare className="w-5 h-5 text-fuchsia-400" />
            {totalUnreadChatCount > 0 ? (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-pink-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse shadow-md shadow-pink-500/50">
                {totalUnreadChatCount}
              </span>
            ) : (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-pink-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-fuchsia-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`py-3 px-1 flex flex-col gap-1 cursor-pointer transition-colors ${
                          n.is_read ? 'opacity-60' : 'bg-fuchsia-500/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{n.title}</span>
                          <span className="text-[10px] text-slate-500">{formatDate(n.created_at)}</span>
                        </div>
                        <p className="text-xs text-slate-300">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar Button with Name & Designation */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all text-left"
            title="My Profile"
          >
            <img
              src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250'}
              alt={currentUser?.full_name}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-purple-500/40 shrink-0"
            />
            <div className="hidden sm:flex flex-col min-w-0">
              <span className="text-xs font-bold text-white leading-tight truncate max-w-[130px]">
                {currentUser?.full_name || 'Hamid Saneen'}
              </span>
              <span className="text-[10px] text-fuchsia-400 font-medium leading-tight truncate max-w-[130px]">
                {currentUser?.designation || role.replace('_', ' ')}
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={logout}
      />

      {/* Supabase Sync Modal */}
      <SupabaseSyncModal isOpen={isSyncModalOpen} onClose={() => setIsSyncModalOpen(false)} />

      {/* Cross-Platform Device Installation Modal (Windows, iPhone, Mac, Android) */}
      <PlatformInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </>
  );
};
