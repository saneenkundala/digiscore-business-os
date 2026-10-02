import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Plus,
  Sparkles,
  Trash2,
  Filter
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { SystemNotification } from '../../../types';
import { formatDate } from '../../../lib/utils';

export const NotificationsModule: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, pushNotification } = useData();

  const [typeFilter, setTypeFilter] = useState<string>('All');

  const filteredNotifs = notifications.filter((n) => {
    if (typeFilter === 'All') return true;
    if (typeFilter === 'Unread') return !n.is_read;
    return n.type === typeFilter;
  });

  const getIcon = (type: SystemNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-400" />;
      default:
        return <Info className="w-5 h-5 text-purple-400" />;
    }
  };

  // Test notification trigger buttons to verify real-time alert engine
  const handleTriggerDemo = (type: 'lead' | 'approval' | 'overdue' | 'payment') => {
    switch (type) {
      case 'lead':
        pushNotification('New Inbound Lead! 🎯', 'Dr. Reem from Dubai Marina Wellness submitted an inquiry for Meta Ads.', 'info');
        break;
      case 'approval':
        pushNotification('Deliverable Approved! ✅', 'Sheikhs Gold authorized the Ramadan 4K teaser video for publication.', 'success');
        break;
      case 'overdue':
        pushNotification('Critical Task Overdue! ⚠️', 'Task "Setup Retargeting Pixel" has breached the deadline milestone.', 'warning');
        break;
      case 'payment':
        pushNotification('Payment Settled! 💰', 'Received ₹1,20,000 NEFT wire transfer for Enterprise Dominance retainer.', 'success');
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-fuchsia-400" />
            Agency Real-time Notification Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            System alerts for incoming leads, overdue sprint tasks, client approvals, and billing milestones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={markAllNotificationsRead}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Simulator buttons */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Simulate Live Agency Events:
        </span>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => handleTriggerDemo('lead')}
            className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-semibold hover:bg-purple-500/20 transition-colors"
          >
            + New Inbound Lead
          </button>
          <button
            onClick={() => handleTriggerDemo('approval')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
          >
            + Client Approval Received
          </button>
          <button
            onClick={() => handleTriggerDemo('overdue')}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
          >
            + Task Overdue Alarm
          </button>
          <button
            onClick={() => handleTriggerDemo('payment')}
            className="px-3 py-1.5 rounded-xl bg-pink-500/10 text-pink-300 border border-pink-500/20 text-xs font-semibold hover:bg-pink-500/20 transition-colors"
          >
            + Settlement Wire Received
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 p-2 rounded-2xl glass-panel border border-slate-800">
        {(['All', 'Unread', 'info', 'success', 'warning'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors capitalize ${
              typeFilter === t ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl glass-panel border border-slate-800 p-4 divide-y divide-slate-800/60 shadow-2xl">
        {filteredNotifs.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-12">No notifications found.</p>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`py-4 px-3 flex items-start gap-4 transition-colors cursor-pointer rounded-xl ${
                n.is_read ? 'opacity-60' : 'bg-fuchsia-500/5'
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  <span className="text-[11px] text-slate-500">{formatDate(n.created_at)}</span>
                </div>
                <p className="text-xs text-slate-300">{n.message}</p>
              </div>

              {!n.is_read && (
                <span className="w-2 h-2 rounded-full bg-fuchsia-400 shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
