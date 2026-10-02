import React, { useState } from 'react';
import {
  Building2,
  Users,
  Search,
  Plus,
  ExternalLink,
  Phone,
  Mail,
  FolderGit2,
  Receipt,
  Sparkles,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  FileText
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { Client } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { formatCurrency, formatDate } from '../../../lib/utils';

interface ClientsListProps {
  onNavigate: (module: string) => void;
}

export const ClientsList: React.FC<ClientsListProps> = ({ onNavigate }) => {
  const { clients, addClient, updateClient, deleteClient, projects, invoices, contentItems, payments } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'content' | 'invoices'>('overview');

  const [formData, setFormData] = useState({
    name: '',
    website: '',
    brand_color: '#8B5CF6',
    monthly_retainer: 6500,
    primary_contact_name: '',
    primary_contact_email: '',
    primary_contact_phone: '',
    status: 'Active' as Client['status']
  });

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.primary_contact_name && c.primary_contact_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      website: '',
      brand_color: '#8B5CF6',
      monthly_retainer: 6500,
      primary_contact_name: '',
      primary_contact_email: '',
      primary_contact_phone: '',
      status: 'Active'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    addClient({
      ...formData,
      total_billed: formData.monthly_retainer,
      total_paid: 0,
      outstanding_amount: formData.monthly_retainer
    });
    setIsAddModalOpen(false);
  };

  // 360 Client Profile aggregations
  const clientProjects = selectedClient ? projects.filter((p) => p.client_id === selectedClient.id) : [];
  const clientInvoices = selectedClient ? invoices.filter((i) => i.client_id === selectedClient.id) : [];
  const clientContent = selectedClient ? contentItems.filter((c) => c.client_id === selectedClient.id) : [];
  const clientPayments = selectedClient ? payments.filter((p) => p.client_id === selectedClient.id) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-fuchsia-400" />
            Client Directory & Retainer Accounts
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Active agency brand partnerships, billing lifecycles and deliverable progress.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client name, code, or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-all"
          />
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="font-bold text-white">{filteredClients.length}</span> of {clients.length} clients
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => {
          const projs = projects.filter((p) => p.client_id === client.id);
          const activeProjCount = projs.filter((p) => p.status === 'Active').length;

          return (
            <div
              key={client.id}
              className="rounded-2xl glass-panel border border-slate-800 hover:border-fuchsia-500/40 transition-all p-5 flex flex-col justify-between shadow-xl group cursor-pointer relative"
              onClick={() => {
                setSelectedClient(client);
                setIsDetailsOpen(true);
              }}
            >
              {/* Card Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md"
                      style={{ backgroundColor: client.brand_color || '#8B5CF6' }}
                    >
                      {client.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-fuchsia-300 transition-colors">
                        {client.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">{client.client_code}</span>
                    </div>
                  </div>
                  <StatusBadge status={client.status} />
                </div>

                {/* Contact info */}
                <div className="space-y-1 text-xs text-slate-400 pt-1">
                  {client.primary_contact_name && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{client.primary_contact_name}</span>
                    </div>
                  )}
                  {client.primary_contact_phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{client.primary_contact_phone}</span>
                    </div>
                  )}
                  {client.website && (
                    <div className="flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-fuchsia-400 hover:underline truncate"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {client.website.replace('https://', '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                      Monthly Retainer
                    </span>
                    <p className="font-bold text-white mt-0.5">{formatCurrency(client.monthly_retainer)}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                      Outstanding
                    </span>
                    <p
                      className={`font-bold mt-0.5 ${
                        client.outstanding_amount > 0 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {formatCurrency(client.outstanding_amount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 text-slate-400">
                  <span className="flex items-center gap-1">
                    <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>{activeProjCount} Active Sprint</span>
                  </span>
                  <span className="text-fuchsia-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-semibold text-xs">
                    <span>360° Profile</span>
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 360 Client Profile Modal */}
      {selectedClient && (
        <Modal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          title={selectedClient.name}
          subtitle={`Client Account #${selectedClient.client_code} • Lifetime Value: ${formatCurrency(selectedClient.total_billed)}`}
          maxWidth="3xl"
        >
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-fuchsia-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Account Overview
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'projects'
                    ? 'bg-fuchsia-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Projects ({clientProjects.length})
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'content'
                    ? 'bg-fuchsia-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Content Deliverables ({clientContent.length})
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'invoices'
                    ? 'bg-fuchsia-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Billing & Invoices ({clientInvoices.length})
              </button>
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Billed LTV</span>
                    <p className="text-lg font-extrabold text-white mt-1">
                      {formatCurrency(selectedClient.total_billed)}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Settled Amount</span>
                    <p className="text-lg font-extrabold text-emerald-400 mt-1">
                      {formatCurrency(selectedClient.total_paid)}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Current Balance</span>
                    <p
                      className={`text-lg font-extrabold mt-1 ${
                        selectedClient.outstanding_amount > 0 ? 'text-amber-400' : 'text-slate-400'
                      }`}
                    >
                      {formatCurrency(selectedClient.outstanding_amount)}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Primary Key Contact & Access
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-slate-400">Contact Executive</p>
                      <p className="font-bold text-white mt-0.5">{selectedClient.primary_contact_name}</p>
                      <p className="text-slate-400 mt-0.5">{selectedClient.primary_contact_email}</p>
                      <p className="text-slate-400">{selectedClient.primary_contact_phone}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Agency Retainer Scope</p>
                      <p className="font-bold text-fuchsia-300 mt-0.5">Scale Acceleration (Monthly)</p>
                      <p className="text-slate-400 mt-0.5">Brand Hex: <span className="font-mono text-white">{selectedClient.brand_color}</span></p>
                      <p className="text-slate-400">Status: <StatusBadge status={selectedClient.status} /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-3">
                {clientProjects.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No projects registered yet.</p>
                ) : (
                  clientProjects.map((p) => (
                    <div key={p.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{p.name}</span>
                          <StatusBadge status={p.status} />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          PM: {p.project_manager_name} • Progress: {p.progress_percentage}%
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">{formatCurrency(p.budget)}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: Content */}
            {activeTab === 'content' && (
              <div className="space-y-3">
                {clientContent.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No deliverables assigned yet.</p>
                ) : (
                  clientContent.map((c) => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{c.topic}</span>
                          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                            {c.content_type}
                          </span>
                          <StatusBadge status={c.status} />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Deadline: {formatDate(c.deadline)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: Invoices */}
            {activeTab === 'invoices' && (
              <div className="space-y-3">
                {clientInvoices.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No invoices issued yet.</p>
                ) : (
                  clientInvoices.map((inv) => (
                    <div key={inv.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-fuchsia-300">{inv.invoice_number}</span>
                          <StatusBadge status={inv.status} />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Due: {formatDate(inv.due_date)} • Balance: {formatCurrency(inv.balance)}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-white">{formatCurrency(inv.total)}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Add Client Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Agency Client"
        subtitle="Establish a new brand partnership and retainer profile"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Brand Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Royal Mirage Perfumes"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Website URL</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://client.com"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Retainer (₹ INR)</label>
              <input
                type="number"
                value={formData.monthly_retainer}
                onChange={(e) => setFormData({ ...formData, monthly_retainer: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Contact Name</label>
              <input
                type="text"
                value={formData.primary_contact_name}
                onChange={(e) => setFormData({ ...formData, primary_contact_name: e.target.value })}
                placeholder="CEO / Marketing Director"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Contact Phone</label>
              <input
                type="text"
                value={formData.primary_contact_phone}
                onChange={(e) => setFormData({ ...formData, primary_contact_phone: e.target.value })}
                placeholder="+971 50 123 4567"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
            <input
              type="email"
              value={formData.primary_contact_email}
              onChange={(e) => setFormData({ ...formData, primary_contact_email: e.target.value })}
              placeholder="contact@client.com"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95"
            >
              Save Client
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
