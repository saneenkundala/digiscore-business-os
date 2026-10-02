import React, { useState } from 'react';
import {
  Sparkles,
  FolderGit2,
  CheckCircle2,
  Receipt,
  FileText,
  DollarSign,
  Download,
  Check,
  RotateCcw,
  MessageSquare,
  ShieldCheck,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { StatusBadge } from '../../common/StatusBadge';
import { formatCurrency, formatDate } from '../../../lib/utils';
import confetti from 'canvas-confetti';

interface ClientPortalProps {
  onNavigate: (module: string) => void;
  currentModule?: string;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ onNavigate, currentModule }) => {
  const { user } = useAuth();
  const { clients, projects, contentItems, invoices, payments, documents, approveContent, requestContentChanges } = useData();

  // Selected client account (defaults to 360 Turning Point)
  const currentClient = clients.find((c) => c.name.includes('360')) || clients[0];

  const clientProjects = projects.filter((p) => p.client_id === currentClient.id);
  const clientContent = contentItems.filter((c) => c.client_id === currentClient.id);
  const clientInvoices = invoices.filter((i) => i.client_id === currentClient.id);
  const clientPayments = payments.filter((p) => p.client_id === currentClient.id);
  const clientDocs = documents.filter((d) => d.client_name?.includes('360') || d.category === 'Contracts');

  const pendingApprovals = clientContent.filter((c) => ['Client Approval', 'Internal Review'].includes(c.status));

  const [activeTab, setActiveTab] = useState<'dashboard' | 'deliverables' | 'invoices' | 'assets'>('dashboard');

  React.useEffect(() => {
    if (currentModule === 'projects' || currentModule === 'content') {
      setActiveTab('deliverables');
    } else if (currentModule === 'invoices') {
      setActiveTab('invoices');
    } else if (currentModule === 'documents') {
      setActiveTab('assets');
    } else if (currentModule === 'portal') {
      setActiveTab('dashboard');
    }
  }, [currentModule]);
  const [feedbackPrompt, setFeedbackPrompt] = useState<{ id: string; open: boolean }>({ id: '', open: false });
  const [feedbackText, setFeedbackText] = useState('');

  const handleApprove = (id: string) => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    approveContent(id, 'Approved via Client Portal');
  };

  const handleSendFeedback = (id: string) => {
    if (!feedbackText) return;
    requestContentChanges(id, feedbackText);
    setFeedbackPrompt({ id: '', open: false });
    setFeedbackText('');
  };

  return (
    <div className="space-y-6">
      {/* Client Welcome Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900/60 via-slate-900 to-fuchsia-900/60 border border-purple-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/30 text-xs font-bold text-fuchsia-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Client Portal — DIGI SCORE
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {currentClient.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Real-time agency collaboration hub. Review creative deliverables, authorize brand campaigns, view monthly billing statements, and download production assets.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-right space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Account Retainer</span>
            <p className="text-xl font-extrabold text-white">{formatCurrency(currentClient.monthly_retainer)}/mo</p>
            <span className="text-[11px] text-emerald-400 font-semibold">Active & In Good Standing</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 p-2 rounded-2xl glass-panel border border-slate-800">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'dashboard' ? 'bg-fuchsia-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Portal Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('deliverables')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'deliverables' ? 'bg-fuchsia-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Deliverables & Approvals ({clientContent.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'invoices' ? 'bg-fuchsia-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Invoices & Payments ({clientInvoices.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'assets' ? 'bg-fuchsia-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Contracts & Assets ({clientDocs.length})</span>
        </button>
      </div>

      {/* TAB 1: PORTAL OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Action Required Banner if pending approvals */}
          {pendingApprovals.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-transparent border border-pink-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    You have {pendingApprovals.length} deliverable(s) awaiting your review!
                  </h4>
                  <p className="text-xs text-slate-300">
                    Approve designs or request revisions to keep the publishing schedule on track.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('deliverables')}
                className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs shadow-md shrink-0"
              >
                Review Now
              </button>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60">
              <span className="text-xs text-slate-400 font-semibold uppercase">Active Sprints</span>
              <p className="text-2xl font-extrabold text-white mt-1">{clientProjects.length}</p>
              <p className="text-xs text-purple-300 mt-0.5">Scale Acceleration Retainer</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60">
              <span className="text-xs text-slate-400 font-semibold uppercase">Published Assets</span>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">
                {clientContent.filter((c) => c.status === 'Approved' || c.status === 'Scheduled').length}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Posters & Reels approved</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60">
              <span className="text-xs text-slate-400 font-semibold uppercase">Outstanding Invoice Balance</span>
              <p className="text-2xl font-extrabold text-amber-400 mt-1">
                {formatCurrency(currentClient.outstanding_amount)}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Next cycle due in 10 days</p>
            </div>
          </div>

          {/* Current Projects Progress */}
          <div className="rounded-2xl glass-panel border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Active Project Sprint</h3>
            {clientProjects.map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{p.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Manager: {p.project_manager_name}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Deliverable Completion</span>
                    <span className="font-bold text-fuchsia-400">{p.progress_percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500"
                      style={{ width: `${p.progress_percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DELIVERABLES & APPROVALS */}
      {activeTab === 'deliverables' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientContent.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl glass-panel border border-slate-800 overflow-hidden flex flex-col justify-between shadow-xl"
            >
              <div className="relative aspect-[4/3] bg-slate-900">
                <img src={item.file_url} alt={item.topic} className="w-full h-full object-cover" />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-fuchsia-300 font-bold text-xs border border-fuchsia-500/30">
                    {item.content_type}
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <StatusBadge status={item.status} />
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{item.topic}</h4>
                  <p className="text-xs text-slate-300 mt-1 italic">"{item.caption}"</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Due: {formatDate(item.deadline)}</span>
                    <span className="text-purple-300 font-semibold">DIGI SCORE Studio</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {item.status !== 'Approved' ? (
                      <>
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow hover:opacity-90"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Deliverable</span>
                        </button>
                        <button
                          onClick={() => setFeedbackPrompt({ id: item.id, open: true })}
                          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                        >
                          Request Edits
                        </button>
                      </>
                    ) : (
                      <div className="w-full py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-center text-xs font-bold border border-emerald-500/30 flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4" />
                        <span>Authorized for Publishing</span>
                      </div>
                    )}
                  </div>

                  {feedbackPrompt.open && feedbackPrompt.id === item.id && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 mt-2">
                      <textarea
                        rows={3}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="What changes would you like us to make?"
                        className="w-full p-2 rounded-lg bg-slate-950 text-xs text-white border border-slate-700 focus:outline-none focus:border-fuchsia-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setFeedbackPrompt({ id: '', open: false })}
                          className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSendFeedback(item.id)}
                          className="px-3 py-1 text-xs bg-fuchsia-600 text-white font-semibold rounded-lg"
                        >
                          Send Feedback
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: INVOICES & PAYMENTS */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Invoice #</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                  <th className="py-3 px-4 font-semibold">Issue Date</th>
                  <th className="py-3 px-4 font-semibold">Due Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Total</th>
                  <th className="py-3 px-4 font-semibold text-right">Balance Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {clientInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-mono font-bold text-fuchsia-300">{inv.invoice_number}</td>
                    <td className="py-3 px-4 text-white font-medium">{inv.items[0]?.description || 'Retainer'}</td>
                    <td className="py-3 px-4 text-slate-400">{formatDate(inv.invoice_date)}</td>
                    <td className="py-3 px-4 text-slate-400">{formatDate(inv.due_date)}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-white">{formatCurrency(inv.total)}</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-400">{formatCurrency(inv.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CONTRACTS & ASSETS */}
      {activeTab === 'assets' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {clientDocs.map((doc) => (
            <div key={doc.id} className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{doc.title}</h4>
                  <span className="text-[10px] text-slate-400">{doc.category} • {(doc.file_size / 1024 / 1024).toFixed(1)} MB</span>
                </div>
              </div>
              <a
                href={doc.file_url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="Download / View"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
