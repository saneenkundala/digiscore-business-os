import React from 'react';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = 'sm' }) => {
  const getStyle = (s: string) => {
    const val = s.toLowerCase();
    // Positive / Completed / Won / Paid / Approved / Present
    if (['won', 'paid', 'approved', 'completed', 'active', 'present', 'accepted'].includes(val)) {
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
    // High / Urgent / Overdue / Rejected / Terminated / Lost
    if (['urgent', 'overdue', 'rejected', 'lost', 'terminated', 'cancelled'].includes(val)) {
      return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
    // Warning / In Progress / Designing / Review / Meeting / Partially Paid / Half Day / High
    if (['in progress', 'designing', 'review', 'client approval', 'negotiation', 'meeting', 'partially paid', 'half day', 'high', 'proposal sent', 'proposal'].includes(val)) {
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    }
    // Primary / Info / New / Planning / Scheduled / Contacted / Qualified
    if (['new', 'new lead', 'planning', 'scheduled', 'contacted', 'qualified', 'sent', 'viewed'].includes(val)) {
      return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    }
    // Neutral / Draft / Pending / Low / Absent / On Hold / Leave
    return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border rounded-full transition-colors',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        getStyle(status),
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {status}
    </span>
  );
};
