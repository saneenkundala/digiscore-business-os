import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { Modal } from './Modal';
import { isSupabaseConfigured, checkSupabaseConnection } from '../../lib/supabase';
import { useData } from '../../context/DataContext';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({ isOpen, onClose }) => {
  const { resetToInitialData } = useData();
  const [checking, setChecking] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{ connected: boolean; message: string }>({
    connected: isSupabaseConfigured,
    message: isSupabaseConfigured ? 'Connected to live Supabase instance.' : 'Active in Local Storage Engine (Full Offline Persistence).'
  });

  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);

  const testConnection = async () => {
    setChecking(true);
    const res = await checkSupabaseConnection();
    setConnectionResult(res);
    setChecking(false);
  };

  useEffect(() => {
    if (isOpen) {
      testConnection();
    }
  }, [isOpen]);

  const handleCopySchema = () => {
    navigator.clipboard.writeText('-- Run supabase/migrations/001_initial_schema.sql in your Supabase SQL editor');
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Supabase Database & Cloud Sync" subtitle="PostgreSQL Schema, RLS & Connection Status" maxWidth="2xl">
      <div className="space-y-6">
        {/* Status banner */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            connectionResult.connected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-purple-500/10 border-purple-500/30 text-purple-300'
          }`}
        >
          {connectionResult.connected ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
          ) : (
            <Database className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
          )}
          <div className="text-sm">
            <p className="font-semibold text-white">
              {connectionResult.connected ? 'Live Supabase Cloud Connected' : 'Local Storage Engine Active (Full CRUD Enabled)'}
            </p>
            <p className="mt-1 text-slate-300 leading-relaxed">{connectionResult.message}</p>
          </div>
        </div>

        {/* Database Architecture Info */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-fuchsia-400" />
              PostgreSQL Database Schema (32+ Normalized Tables)
            </h4>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Postgres 15+ / Supabase
            </span>
          </div>
          <p className="text-xs text-slate-400">
            All tables (roles, employees, companies, clients, leads, deals, projects, tasks, content, invoices, expenses, attendance, leave, salaries, documents) are defined with foreign keys, indexes, and Row Level Security in <code className="text-fuchsia-300">supabase/migrations/</code>.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Schema File</span>
                <p className="text-xs font-mono text-white">001_initial_schema.sql</p>
              </div>
              <span className="text-xs text-emerald-400 font-medium">Ready</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Seed Data</span>
                <p className="text-xs font-mono text-white">002_seed_data.sql</p>
              </div>
              <span className="text-xs text-emerald-400 font-medium">Hydrated</span>
            </div>
          </div>
        </div>

        {/* How to Connect Live Supabase */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white">How to Connect Your Live Supabase Project:</h4>
          <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <li>Create a new free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-fuchsia-400 underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-3 h-3" /></a></li>
            <li>Go to <strong>SQL Editor</strong> and execute <code className="text-purple-300">supabase/migrations/001_initial_schema.sql</code> and <code className="text-purple-300">002_seed_data.sql</code></li>
            <li>Copy your Project URL and Anon Public Key from <strong>Settings &gt; API</strong></li>
            <li>Paste them in the project's <code className="text-fuchsia-300">.env</code> file:
              <pre className="mt-1 p-2 rounded bg-slate-900 text-slate-300 font-mono text-[11px] overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...`}
              </pre>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={resetToInitialData}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            Reset local data to factory seed
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={testConnection}
              disabled={checking}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Checking...' : 'Check Supabase'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
