import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  CheckSquare,
  Menu
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface MobileBottomNavProps {
  currentModule: string;
  onNavigate: (module: string) => void;
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentModule,
  onNavigate,
  onOpenMenu
}) => {
  const { totalUnreadChatCount } = useData();
  const { isClient, role } = useAuth();

  const isDashboardActive = currentModule === 'dashboard' || currentModule === 'portal';
  const isChatActive = currentModule === 'communication';
  const isCrmActive = currentModule.startsWith('crm');
  const isTasksActive = currentModule === 'projects' || currentModule === 'projects-tasks';

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl transition-all select-none"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        {/* 1. Dashboard / Portal */}
        <button
          type="button"
          onClick={() => onNavigate(isClient ? 'portal' : 'dashboard')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all ${
            isDashboardActive
              ? 'text-fuchsia-400 font-bold bg-fuchsia-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <LayoutDashboard className="w-5 h-5" />
            {isDashboardActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium tracking-tight">Home</span>
        </button>

        {/* 2. Team Chat & Messenger (with live unread badge!) */}
        <button
          type="button"
          onClick={() => onNavigate('communication')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all relative ${
            isChatActive
              ? 'text-fuchsia-400 font-bold bg-fuchsia-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {totalUnreadChatCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-pink-500 text-[10px] font-extrabold text-white flex items-center justify-center animate-pulse shadow-md shadow-pink-500/50">
                {totalUnreadChatCount > 9 ? '9+' : totalUnreadChatCount}
              </span>
            )}
            {isChatActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium tracking-tight">Chat</span>
        </button>

        {/* 3. CRM / Leads (Only for agency staff) */}
        {!isClient && (
          <button
            type="button"
            onClick={() => onNavigate('crm-leads')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all ${
              isCrmActive
                ? 'text-fuchsia-400 font-bold bg-fuchsia-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Users className="w-5 h-5" />
              {isCrmActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium tracking-tight">Leads</span>
          </button>
        )}

        {/* 4. Projects & Tasks */}
        <button
          type="button"
          onClick={() => onNavigate(isClient ? 'portal' : 'projects-tasks')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all ${
            isTasksActive
              ? 'text-fuchsia-400 font-bold bg-fuchsia-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <CheckSquare className="w-5 h-5" />
            {isTasksActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium tracking-tight">Tasks</span>
        </button>

        {/* 5. Full Menu Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-95"
          title="Open Full Navigation Menu"
        >
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800">
            <Menu className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-[10px] mt-1 font-medium tracking-tight text-slate-300">Menu</span>
        </button>
      </div>
    </nav>
  );
};
