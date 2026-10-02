import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Building,
  Calendar,
  DollarSign,
  User,
  ArrowRight,
  Sparkles,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Send,
  MoreVertical,
  Download
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Lead, LeadStatus } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { formatCurrency, formatDate, exportToCSV } from '../../../lib/utils';
import confetti from 'canvas-confetti';

interface CRMLeadsProps {
  onNavigate: (module: string) => void;
  externalSearch?: string;
}

export const CRMLeads: React.FC<CRMLeadsProps> = ({ onNavigate, externalSearch = '' }) => {
  const { leads, addLead, updateLead, deleteLead, convertLeadToClient, employees, services } = useData();
  const { hasPermission } = useAuth();

  const [searchQuery, setSearchQuery] = useState(externalSearch);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    whatsapp: '',
    email: '',
    location: '',
    industry: '',
    lead_source: 'LinkedIn Ads',
    interested_service: 'Brand Strategy & Identity',
    estimated_budget: 10000,
    status: 'New' as LeadStatus,
    assigned_salesperson_id: 'emp-2',
    notes: ''
  });

  const statuses: LeadStatus[] = [
    'New',
    'Contacted',
    'Qualified',
    'Meeting',
    'Proposal Sent',
    'Negotiation',
    'Won',
    'Lost'
  ];

  // Filtering
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.lead_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.industry && lead.industry.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      company: '',
      phone: '',
      whatsapp: '',
      email: '',
      location: 'Dubai, UAE',
      industry: 'Technology',
      lead_source: 'Referral',
      interested_service: 'Scale Acceleration Package',
      estimated_budget: 6500,
      status: 'New',
      assigned_salesperson_id: employees[1]?.id || employees[0]?.id || '',
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      company: lead.company,
      phone: lead.phone || '',
      whatsapp: lead.whatsapp || '',
      email: lead.email || '',
      location: lead.location || '',
      industry: lead.industry || '',
      lead_source: lead.lead_source || 'Referral',
      interested_service: lead.interested_service || '',
      estimated_budget: lead.estimated_budget,
      status: lead.status,
      assigned_salesperson_id: lead.assigned_salesperson_id || '',
      notes: lead.notes || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company) return;
    addLead(formData);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    updateLead(selectedLead.id, formData);
    setIsEditModalOpen(false);
  };

  const handleConvert = (lead: Lead) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    convertLeadToClient(lead.id);
    setIsDetailsOpen(false);
    onNavigate('clients-all');
  };

  const handleExport = () => {
    exportToCSV('DIGISCORE_Leads', filteredLeads);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-fuchsia-400" />
            Lead Management & Opportunities
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Capture, qualify, nurture and convert high-value agency prospects.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company, contact, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-all"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
              statusFilter === 'All'
                ? 'bg-fuchsia-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All ({leads.length})
          </button>
          {statuses.map((st) => {
            const count = leads.filter((l) => l.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 ${
                  statusFilter === st
                    ? 'bg-fuchsia-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{st}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Lead ID</th>
                <th className="py-3.5 px-4 font-semibold">Company & Contact</th>
                <th className="py-3.5 px-4 font-semibold">Service & Budget</th>
                <th className="py-3.5 px-4 font-semibold">Direct Reach</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Next Follow-up</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No leads found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-900/50 transition-colors group cursor-pointer"
                    onClick={() => {
                      setSelectedLead(lead);
                      setIsDetailsOpen(true);
                    }}
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-fuchsia-300">
                      {lead.lead_code}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{lead.company}</div>
                      <div className="text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <User className="w-3 h-3 text-slate-500" />
                        <span>{lead.name}</span>
                        {lead.industry && <span>• {lead.industry}</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">
                        {formatCurrency(lead.estimated_budget)}
                      </div>
                      <div className="text-slate-400 text-[11px] truncate max-w-xs">
                        {lead.interested_service || 'Full Agency Package'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        {lead.whatsapp && (
                          <a
                            href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                            title="WhatsApp Chat"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                            title="Call Lead"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                            title="Send Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {lead.next_followup_at ? (
                        <div className="flex items-center gap-1 text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{formatDate(lead.next_followup_at)}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">None set</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {lead.status === 'Won' ? (
                          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                            Won Client
                          </span>
                        ) : (
                          <button
                            onClick={() => handleConvert(lead)}
                            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-[11px] shadow hover:opacity-90 transition-all flex items-center gap-1"
                            title="Convert Won Lead to Client & Project"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Convert</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(lead)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Lead"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setLeadToDelete(lead);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Details Drawer / Modal */}
      {selectedLead && (
        <Modal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          title={selectedLead.company}
          subtitle={`Lead Code: ${selectedLead.lead_code} • Source: ${selectedLead.lead_source || 'Inbound'}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <span className="text-xs text-slate-400">Current Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedLead.status} size="md" />
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400">Estimated Value</span>
                <p className="text-lg font-bold text-emerald-400">
                  {formatCurrency(selectedLead.estimated_budget)}
                </p>
              </div>
              {selectedLead.status !== 'Won' && (
                <button
                  onClick={() => handleConvert(selectedLead)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 hover:opacity-90 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Mark Won & Convert to Client</span>
                </button>
              )}
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-slate-400">Contact Person</span>
                <p className="font-bold text-white text-sm mt-0.5">{selectedLead.name}</p>
                <p className="text-slate-400 mt-1">{selectedLead.email || 'No email'}</p>
                <p className="text-slate-400">{selectedLead.phone || 'No phone'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-slate-400">Location & Industry</span>
                <p className="font-bold text-white text-sm mt-0.5">{selectedLead.location || 'Dubai, UAE'}</p>
                <p className="text-slate-400 mt-1">Industry: {selectedLead.industry || 'Not specified'}</p>
                <p className="text-slate-400">Interested in: {selectedLead.interested_service || 'All Services'}</p>
              </div>
            </div>

            {/* Notes */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Executive Notes & Context
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedLead.notes || 'No specific notes recorded for this lead.'}
              </p>
            </div>

            {/* Activity Timeline */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Touchpoints & Communication History
              </h4>
              <div className="space-y-3 pl-4 border-l border-slate-800">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <p className="text-xs font-semibold text-white">Proposal Sent & Review Call</p>
                  <p className="text-[11px] text-slate-400">Detailed commercial proposal submitted with 3 tier options.</p>
                  <span className="text-[10px] text-slate-500">{formatDate(selectedLead.last_contact_at || selectedLead.created_at)}</span>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-fuchsia-500" />
                  <p className="text-xs font-semibold text-white">Inbound Lead Captured</p>
                  <p className="text-[11px] text-slate-400">Lead assigned to Tariq Mansoor for rapid qualification.</p>
                  <span className="text-[10px] text-slate-500">{formatDate(selectedLead.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Lead Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isAddModalOpen ? 'Create New Agency Lead' : 'Edit Lead Details'}
        subtitle="Fill in prospect information to log into DIGI SCORE CRM"
        maxWidth="2xl"
      >
        <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Business Name *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Apex Luxury Real Estate"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Contact Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sheikh Rashid"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+971 50 000 0000"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+971 50 000 0000"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@company.com"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Downtown Dubai"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="Hospitality / Retail / Tech"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Budget (₹ INR)</label>
              <input
                type="number"
                value={formData.estimated_budget}
                onChange={(e) => setFormData({ ...formData, estimated_budget: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Interested Service</label>
              <select
                value={formData.interested_service}
                onChange={(e) => setFormData({ ...formData, interested_service: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({formatCurrency(s.base_price)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Lead Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notes & Next Actions</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Key requirements, client objectives, follow-up timeline..."
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95"
            >
              {isAddModalOpen ? 'Create Lead' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          if (leadToDelete) deleteLead(leadToDelete.id);
        }}
        title="Delete Lead"
        message={`Are you sure you want to delete lead "${leadToDelete?.company}"? This will permanently remove its records.`}
        confirmLabel="Delete Lead"
        isDestructive={true}
      />
    </div>
  );
};
