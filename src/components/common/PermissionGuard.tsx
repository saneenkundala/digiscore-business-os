import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ModuleKey, PermissionAction } from '../../types';

interface PermissionGuardProps {
  module: ModuleKey | string;
  action?: PermissionAction;
  moduleName?: string;
  onNavigateHome: () => void;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  module,
  action = 'view',
  moduleName,
  onNavigateHome,
  children
}) => {
  const { hasPermission, role, currentUser } = useAuth();

  const isAllowed = module === 'communication' ? true : hasPermission(module, action);

  if (!isAllowed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-xl shadow-rose-500/10">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Access Denied (403)</h3>
        <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
          Your role (<span className="text-fuchsia-400 font-semibold">{role}</span>) does not have{' '}
          <strong className="text-white uppercase">{action}</strong> permissions for the{' '}
          <strong className="text-white">{moduleName || module}</strong> module.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/25 flex items-center gap-2 hover:opacity-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
