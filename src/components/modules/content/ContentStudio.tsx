import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Eye,
  MessageSquare,
  ThumbsUp,
  RotateCcw,
  Video,
  Image,
  Share2,
  Clock,
  User,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { ContentItem, ContentType, ContentStatus } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';
import { formatDate } from '../../../lib/utils';
import confetti from 'canvas-confetti';

interface ContentStudioProps {
  initialView?: 'calendar' | 'list' | 'approvals';
  onNavigate: (module: string) => void;
}

export const ContentStudio: React.FC<ContentStudioProps> = ({
  initialView = 'calendar',
  onNavigate
}) => {
  const { contentItems, clients, employees, addContentItem, updateContentItem, approveContent, requestContentChanges, deleteContentItem } = useData();
  const { isClient, role } = useAuth();

  const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'approvals'>(initialView);

  React.useEffect(() => {
    if (initialView) {
      setActiveTab(initialView);
    }
  }, [initialView]);
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  // Form
  const [formData, setFormData] = useState({
    client_id: clients[0]?.id || '',
    content_type: 'Poster' as ContentType,
    topic: '',
    caption: '',
    hashtags: '#digiscore #branding #growth #dubaimarketing',
    assigned_designer_name: 'Sarah Al-Hashemi',
    assigned_video_editor_name: 'Rayyan Khan',
    deadline: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
    status: 'Idea' as ContentStatus,
    file_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600'
  });

  const contentTypes: ContentType[] = ['Poster', 'Reel', 'Video', 'Story', 'Carousel', 'Ad Creative', 'Blog'];

  // Filtering
  const filteredItems = contentItems.filter((item) => {
    const matchesClient = selectedClientFilter === 'All' || item.client_id === selectedClientFilter;
    const matchesType = typeFilter === 'All' || item.content_type === typeFilter;
    const matchesApproval = activeTab === 'approvals' ? ['Client Approval', 'Internal Review', 'Approved'].includes(item.status) : true;
    return matchesClient && matchesType && matchesApproval;
  });

  // Client quota summary for 360 Turning Point (demo client package)
  const clientQuota = {
    postersUsed: contentItems.filter((c) => c.client_name?.includes('360') && c.content_type === 'Poster').length,
    postersTotal: 16,
    reelsUsed: contentItems.filter((c) => c.client_name?.includes('360') && c.content_type === 'Reel').length,
    reelsTotal: 8,
    videosUsed: contentItems.filter((c) => c.client_name?.includes('360') && c.content_type === 'Video').length,
    videosTotal: 2
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic || !formData.client_id) return;
    const client = clients.find((c) => c.id === formData.client_id);
    addContentItem({
      ...formData,
      client_name: client?.name || 'Client'
    });
    setIsAddModalOpen(false);
  };

  const handleApprove = (item: ContentItem) => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    approveContent(item.id, 'Approved directly by user.');
    if (selectedItem) setSelectedItem(null);
  };

  const handleSendFeedback = () => {
    if (!selectedItem || !feedbackText) return;
    requestContentChanges(selectedItem.id, feedbackText);
    setIsFeedbackOpen(false);
    setFeedbackText('');
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-fuchsia-400" />
            Agency Content Studio & Approvals
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Produce, track deliverable quotas, schedule social posts, and coordinate client approvals.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Content Item</span>
        </button>
      </div>

      {/* Monthly Retainer Quota Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-purple-500/20 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase">Graphic Posters Quota</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-bold">
              {clientQuota.postersUsed} / {clientQuota.postersTotal} used
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 mt-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-purple-500"
              style={{ width: `${(clientQuota.postersUsed / clientQuota.postersTotal) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {clientQuota.postersTotal - clientQuota.postersUsed} creative posters remaining this billing cycle
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-pink-500/20 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase">Reels & Short-Form</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 font-bold">
              {clientQuota.reelsUsed} / {clientQuota.reelsTotal} used
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 mt-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-pink-500"
              style={{ width: `${(clientQuota.reelsUsed / clientQuota.reelsTotal) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {clientQuota.reelsTotal - clientQuota.reelsUsed} edited reels remaining this billing cycle
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-emerald-500/20 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase">Cinema Promo Videos</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-bold">
              {clientQuota.videosUsed} / {clientQuota.videosTotal} used
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 mt-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${(clientQuota.videosUsed / clientQuota.videosTotal) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {clientQuota.videosTotal - clientQuota.videosUsed} luxury video productions remaining
          </p>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="p-3 rounded-2xl glass-panel border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'calendar' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Content Calendar</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'list' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Content ({contentItems.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'approvals' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
            <span>Approvals Queue</span>
          </button>
        </div>

        {/* Client & Type Filters */}
        <div className="flex items-center gap-2">
          <select
            value={selectedClientFilter}
            onChange={(e) => setSelectedClientFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-fuchsia-500"
          >
            <option value="All">All Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-fuchsia-500"
          >
            <option value="All">All Types</option>
            {contentTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW: CONTENT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl glass-panel border border-slate-800 hover:border-fuchsia-500/40 transition-all overflow-hidden flex flex-col justify-between shadow-xl group"
          >
            {/* Visual Media Thumbnail */}
            <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
              <img
                src={item.file_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600'}
                alt={item.topic}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-fuchsia-300 font-bold text-[10px] border border-fuchsia-500/30">
                  {item.content_type}
                </span>
              </div>

              <div className="absolute top-2.5 right-2.5">
                <StatusBadge status={item.status} />
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <span className="text-[10px] font-mono text-slate-300 font-semibold">{item.content_code}</span>
                <h4 className="text-xs font-bold text-white line-clamp-1">{item.topic}</h4>
              </div>
            </div>

            {/* Item Details */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                  "{item.caption || 'No caption entered yet.'}"
                </p>

                {item.client_feedback && (
                  <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-[10px] text-pink-300">
                    <strong>Client Feedback:</strong> {item.client_feedback}
                  </div>
                )}
              </div>

              {/* Footer info & client approval action */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Client: {item.client_name}</span>
                  <span>Due: {formatDate(item.deadline)}</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {item.status !== 'Approved' && (
                    <button
                      onClick={() => handleApprove(item)}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs flex items-center justify-center gap-1 hover:opacity-90 shadow-md shadow-emerald-600/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsFeedbackOpen(true);
                    }}
                    className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                    title="Request Revisions"
                  >
                    Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Content Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Deliverable Content Item"
        subtitle="Schedule a poster, reel, video, or social asset"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveItem} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Client *</label>
              <select
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Content Type *</label>
              <select
                value={formData.content_type}
                onChange={(e) => setFormData({ ...formData, content_type: e.target.value as ContentType })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {contentTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Topic / Creative Brief *</label>
            <input
              type="text"
              required
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="e.g. 5 Luxury Perfume Layering Tips (Reel)"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Caption / Copy</label>
            <textarea
              rows={3}
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              placeholder="Engaging caption, hook, call to action..."
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Deadline Date</label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Asset Image / Video URL</label>
              <input
                type="url"
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95"
            >
              Create Item
            </button>
          </div>
        </form>
      </Modal>

      {/* Client Feedback / Revision Modal */}
      <Modal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        title="Client Feedback & Revision Request"
        subtitle={`Deliverable: ${selectedItem?.topic}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Describe the revisions requested by the client (e.g. adjust color palette, change audio track, bold subtitles):
          </p>
          <textarea
            rows={4}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Type revision comments..."
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
          />
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsFeedbackOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSendFeedback}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow"
            >
              Submit Revisions
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
