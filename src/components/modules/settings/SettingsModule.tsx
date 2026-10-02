import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Database,
  Building,
  Save,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { isSupabaseConfigured, checkSupabaseConnection } from '../../../lib/supabase';
import { UserRole } from '../../../types';
import { SupabaseSyncModal } from '../../common/SupabaseSyncModal';
import { UserManagementModule } from '../users/UserManagementModule';

export const SettingsModule: React.FC = () => {
  const { role, switchRole, users } = useAuth();
  const { resetToInitialData, clearAllData } = useData();

  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'roles' | 'database' | 'features'>('users');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Agency profile
  const [agencyProfile, setAgencyProfile] = useState({
    name: 'DIGI SCORE',
    tagline: 'One Platform. Complete Business Control.',
    email: 'contact@digiscore.agency',
    phone: '+971 4 800 3444',
    website: 'https://digiscore.agency',
    currency: 'INR',
    tax_rate: 18,
    address: 'Cyber City, Phase 2, Gurugram / MG Road, Bengaluru, India'
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const rolesMatrix: { role: UserRole; label: string; desc: string; modules: string[] }[] = [
    {
      role: 'SUPER_ADMIN',
      label: 'Super Admin',
      desc: 'Complete unrestricted ownership over all agency systems and settings',
      modules: ['All 16 Modules: Full Access (View, Create, Edit, Delete, Approve, Export)']
    },
    {
      role: 'ADMIN',
      label: 'Admin',
      desc: 'Operational management, staff coordination and financials',
      modules: ['CRM, Projects, Tasks, Content, Invoices, HR, Reports']
    },
    {
      role: 'MANAGER',
      label: 'Project Manager',
      desc: 'Sprint delivery, client task assignments, and review approvals',
      modules: ['Projects, Tasks, Content Calendar, Client Approvals, Attendance']
    },
    {
      role: 'SALES',
      label: 'Sales Executive',
      desc: 'Lead prospecting, CRM pipeline, quotations and deal closings',
      modules: ['CRM Leads, Deals Pipeline, Quotations, Client Contacts']
    },
    {
      role: 'ACCOUNTANT',
      label: 'Accountant / Finance',
      desc: 'Invoicing, payments settlement, expense receipts and payroll slips',
      modules: ['Invoices, Payments Ledger, Expenses, Profit & Loss, Salaries']
    },
    {
      role: 'DESIGNER',
      label: 'Graphic Designer',
      desc: 'Deliverable design, posters, carousels, and creative assets',
      modules: ['Content Studio, Assigned Tasks, Media Library']
    },
    {
      role: 'CLIENT',
      label: 'Client Portal User',
      desc: 'Restricted external view for deliverables review and invoice payments',
      modules: ['Client Portal Only: Approve / Reject Content, View Invoices, Download Assets']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-fuchsia-400" />
            System & Agency Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure DIGI SCORE Business OS parameters, Supabase database, and role permissions.
          </p>
        </div>

        <button
          onClick={() => setIsSyncModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-purple-500/30 text-purple-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Database className="w-4 h-4 text-purple-400" />
          <span>Supabase Cloud Sync</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="p-2 rounded-2xl glass-panel border border-slate-800 flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeTab === 'users' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Users & RBAC ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeTab === 'profile' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Agency Profile</span>
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeTab === 'roles' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Roles Matrix</span>
        </button>
        <button
          onClick={() => setActiveTab('features')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeTab === 'features' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Feature Flags</span>
        </button>
      </div>

      {/* TAB: USERS & RBAC */}
      {activeTab === 'users' && <UserManagementModule />}

      {/* TAB: PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="rounded-2xl glass-panel border border-slate-800 p-6 space-y-6 max-w-3xl shadow-xl">
          <div className="space-y-1 pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Agency Brand & Billing Details</h3>
            <p className="text-xs text-slate-400">Used for official invoices, quotations, and client portal headers.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Agency Name</label>
              <input
                type="text"
                value={agencyProfile.name}
                onChange={(e) => setAgencyProfile({ ...agencyProfile, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
              <input
                type="text"
                value={agencyProfile.tagline}
                onChange={(e) => setAgencyProfile({ ...agencyProfile, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
              <input
                type="email"
                value={agencyProfile.email}
                onChange={(e) => setAgencyProfile({ ...agencyProfile, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Office Phone</label>
              <input
                type="text"
                value={agencyProfile.phone}
                onChange={(e) => setAgencyProfile({ ...agencyProfile, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Base Currency</label>
              <select
                value={agencyProfile.currency}
                onChange={(e) => setAgencyProfile({ ...agencyProfile, currency: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                <option value="INR">INR (₹ Indian Rupee)</option>
                <option value="AED">AED (د.إ UAE Dirham)</option>
                <option value="USD">USD ($ US Dollar)</option>
                <option value="EUR">EUR (€ Euro)</option>
                <option value="SAR">SAR (﷼ Saudi Riyal)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Standard GST / Tax Rate (%)</label>
              <input
                type="number"
                value={agencyProfile.tax_rate}
                onChange={(e) => setAgencyProfile({ ...agencyProfile, tax_rate: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Headquarters Address</label>
            <input
              type="text"
              value={agencyProfile.address}
              onChange={(e) => setAgencyProfile({ ...agencyProfile, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all operational records? This will delete all dummy leads, clients, projects, tasks, invoices, expenses, attendance, and chats.')) {
                  clearAllData();
                }
              }}
              className="px-3.5 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>🗑️ Clear All Software Data (ഡാറ്റ ക്ലിയർ ചെയ്യുക)</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* TAB: ROLES & RLS */}
      {activeTab === 'roles' && (
        <div className="space-y-4 max-w-4xl">
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200">
            <strong>Security Notice:</strong> In addition to UI role guards, Row Level Security (RLS) is fully defined in <code className="text-white">supabase/migrations/001_initial_schema.sql</code>, ensuring clients cannot query internal agency records directly from the database layer.
          </div>

          <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl divide-y divide-slate-800/80">
            {rolesMatrix.map((r) => (
              <div key={r.role} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-fuchsia-300">{r.role}</span>
                    <span className="text-xs font-bold text-white">({r.label})</span>
                    {role === r.role && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        Current Active View
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{r.desc}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{r.modules.join(', ')}</p>
                </div>

                <button
                  onClick={() => switchRole(r.role)}
                  className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold shrink-0"
                >
                  Test This Role
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: FEATURES */}
      {activeTab === 'features' && (
        <div className="rounded-2xl glass-panel border border-slate-800 p-6 space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-white">System Feature Switches</h3>
          <div className="space-y-3">
            {[
              { title: 'Client Portal Mode', desc: 'Allow client users to log in and approve content deliverables' },
              { title: 'Supabase Realtime Websockets', desc: 'Instantly push updates when tasks or leads are changed' },
              { title: 'Automated Invoice PDF Engine', desc: 'Client one-click PDF generation via jsPDF' },
              { title: 'Multi-Tenant SaaS Support', desc: 'Pre-configured database architecture ready for multi-agency tenancy' }
            ].map((f, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <p className="text-xs font-bold text-white">{f.title}</p>
                  <p className="text-[11px] text-slate-400">{f.desc}</p>
                </div>
                <div className="w-10 h-5 rounded-full bg-fuchsia-600 flex items-center justify-end px-0.5">
                  <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sync modal */}
      <SupabaseSyncModal isOpen={isSyncModalOpen} onClose={() => setIsSyncModalOpen(false)} />
    </div>
  );
};
