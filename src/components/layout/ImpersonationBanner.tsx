import React from 'react';
import { Eye, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ImpersonationBanner: React.FC = () => {
  const { isImpersonating, impersonatedUser, stopImpersonation } = useAuth();

  if (!isImpersonating || !impersonatedUser) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-lg sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4 animate-pulse" />
        <span>
          Viewing system perspective as: <strong className="underline">{impersonatedUser.full_name}</strong> (Role: <span className="uppercase font-bold tracking-wide">{impersonatedUser.role_key}</span>)
        </span>
      </div>

      <button
        onClick={stopImpersonation}
        className="px-3 py-1 rounded-lg bg-black/30 hover:bg-black/50 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all border border-white/20"
      >
        <XCircle className="w-3.5 h-3.5" />
        <span>Exit Preview Mode</span>
      </button>
    </div>
  );
};
