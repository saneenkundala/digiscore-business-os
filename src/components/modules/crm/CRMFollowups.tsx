import React, { useState } from 'react';
import {
  Clock,
  Plus,
  CheckCircle2,
  Calendar,
  User,
  Trash2,
  Search,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { Followup } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';
import { formatDate } from '../../../lib/utils';

export const CRMFollowups: React.FC = () => {
  const { followups, addFollowup, completeFollowup, deleteFollowup, leads, clients, employees } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    lead_name: leads[0]?.company || '',
    due_date: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    status: 'Pending' as Followup['status'],
    notes: '',
    assigned_name: employees[1]?.first_name + ' ' + employees[1]?.last_name
  });

  const filteredFollowups = followups.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.lead_name && f.lead_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.client_name && f.client_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.assigned_name && f.assigned_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    addFollowup(formData);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-fuchsia-400" />
            CRM Follow-ups & Reminders
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Never lose an agency deal with scheduled touchpoints, calls, and meeting alarms.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search follow-ups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['All', 'Pending', 'Completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === st ? 'bg-fuchsia-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Follow-ups List */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Title & Context</th>
              <th className="py-3 px-4 font-semibold">Related Entity</th>
              <th className="py-3 px-4 font-semibold">Assigned Staff</th>
              <th className="py-3 px-4 font-semibold">Scheduled Date</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredFollowups.map((fol) => {
              const isOverdue = fol.status === 'Pending' && new Date(fol.due_date) < new Date();

              return (
                <tr key={fol.id} className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white text-sm">{fol.title}</span>
                    {fol.notes && <p className="text-slate-400 text-xs mt-0.5">{fol.notes}</p>}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-semibold">
                    {fol.lead_name || fol.client_name || 'Prospect'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{fol.assigned_name}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-400' : 'text-slate-500'}`} />
                      <span className={isOverdue ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {formatDate(fol.due_date)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={isOverdue ? 'Overdue' : fol.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {fol.status === 'Pending' && (
                        <button
                          onClick={() => completeFollowup(fol.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-semibold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Complete</span>
                        </button>
                      )}
                      <button
                        onClick={() => deleteFollowup(fol.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Schedule Followup Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Follow-up Reminder"
        subtitle="Set an alarm for prospect reach-out or client call"
        maxWidth="md"
      >
        <form onSubmit={handleSaveFollowup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Follow-up Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Call CEO to review proposal feedback"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Lead / Client Name</label>
              <input
                type="text"
                value={formData.lead_name}
                onChange={(e) => setFormData({ ...formData, lead_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Salesperson</label>
              <select
                value={formData.assigned_name}
                onChange={(e) => setFormData({ ...formData, assigned_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {employees.map((e) => (
                  <option key={e.id} value={`${e.first_name} ${e.last_name}`}>
                    {e.first_name} {e.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date & Time *</label>
            <input
              type="datetime-local"
              required
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notes & Objectives</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow"
            >
              Schedule Follow-up
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
