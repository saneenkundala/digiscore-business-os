import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  Users,
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  Send,
  MessageCircle
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { CommunicationLog } from '../../../types';
import { Modal } from '../../common/Modal';
import { formatDate } from '../../../lib/utils';
import { TeamChat } from './TeamChat';

export const CommunicationModule: React.FC = () => {
  const { communications, logCommunication, leads, clients } = useData();
  const { user } = useAuth();

  const [activeView, setActiveView] = useState<'chat' | 'logs'>('chat');
  const [channelFilter, setChannelFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    channel: 'WhatsApp' as CommunicationLog['channel'],
    subject: '',
    details: '',
    client_name: clients[0]?.name || '',
    lead_name: '',
    logged_by: user?.full_name || 'Admin'
  });

  const channels: CommunicationLog['channel'][] = ['WhatsApp', 'Phone Calls', 'Email', 'Meetings', 'Notes'];

  const filteredLogs = communications.filter((log) => {
    const matchesChannel = channelFilter === 'All' || log.channel === channelFilter;
    const matchesSearch =
      log.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.client_name && log.client_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.lead_name && log.lead_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesChannel && matchesSearch;
  });

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.details) return;
    logCommunication(formData);
    setIsLogModalOpen(false);
    setFormData({
      channel: 'WhatsApp',
      subject: '',
      details: '',
      client_name: clients[0]?.name || '',
      lead_name: '',
      logged_by: user?.full_name || 'Admin'
    });
  };

  const getChannelIcon = (ch: CommunicationLog['channel']) => {
    switch (ch) {
      case 'WhatsApp':
        return <MessageCircle className="w-4 h-4 text-emerald-400" />;
      case 'Phone Calls':
        return <Phone className="w-4 h-4 text-purple-400" />;
      case 'Email':
        return <Mail className="w-4 h-4 text-blue-400" />;
      case 'Meetings':
        return <Users className="w-4 h-4 text-fuchsia-400" />;
      case 'Notes':
        return <FileText className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-fuchsia-400" />
            <span>Internal Team Chat & Omnichannel Hub</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time direct messaging, voice notes 🎙️, media sharing 🎨, and client interaction logs.
          </p>
        </div>

        {/* View Toggle: Team Chat vs Client Logs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveView('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'chat'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Team Chat (സ്റ്റാഫ് ചാറ്റ്)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'logs'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Client Comms Log</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: STAFF TEAM CHAT */}
      {activeView === 'chat' && <TeamChat />}

      {/* VIEW 2: CLIENT OMNICHANNEL LOGS */}
      {activeView === 'logs' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Log Client Communication</span>
            </button>
          </div>

          {/* Filter and Search */}
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search communications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setChannelFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              channelFilter === 'All' ? 'bg-fuchsia-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Channels ({communications.length})
          </button>
          {channels.map((ch) => (
            <button
              key={ch}
              onClick={() => setChannelFilter(ch)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                channelFilter === ch ? 'bg-fuchsia-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline View */}
      <div className="rounded-2xl glass-panel border border-slate-800 p-6 space-y-6">
        <h3 className="text-base font-bold text-white">Chronological Touchpoint Timeline</h3>

        <div className="space-y-6 relative pl-6 border-l-2 border-slate-800 ml-4">
          {filteredLogs.map((log) => (
            <div key={log.id} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-fuchsia-500 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
              </div>

              {/* Card */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-slate-800 border border-slate-700">
                      {getChannelIcon(log.channel)}
                    </span>
                    <h4 className="text-sm font-bold text-white">{log.subject}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                      {log.channel}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {formatDate(log.communicated_at)}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pl-1">{log.details}</p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Related to: <strong className="text-white">{log.client_name || log.lead_name || 'Prospect'}</strong></span>
                  <span>Logged by: {log.logged_by}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Client Touchpoint"
        subtitle="Record communication history across WhatsApp, Call or Meeting"
        maxWidth="md"
      >
        <form onSubmit={handleSaveLog} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Communication Channel *</label>
              <select
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {channels.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Related Client / Lead</label>
              <select
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Subject / Meeting Topic *</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Discussed Ramadan campaign shoot dates"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Discussion Notes *</label>
            <textarea
              rows={3}
              required
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Summary of conversation, key deliverables discussed, next commitments..."
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsLogModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow"
            >
              Save Log
            </button>
          </div>
        </form>
      </Modal>
        </div>
      )}
    </div>
  );
};
