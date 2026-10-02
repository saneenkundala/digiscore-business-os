import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Download,
  Trash2,
  ExternalLink,
  Folder,
  FileCheck,
  Building,
  UploadCloud
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { DocumentItem, DocumentCategory } from '../../../types';
import { Modal } from '../../common/Modal';
import { formatDate } from '../../../lib/utils';

export const DocumentsModule: React.FC = () => {
  const { documents, addDocument, deleteDocument, clients } = useData();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'Contracts' as DocumentCategory,
    file_name: 'Proposal_Document.pdf',
    file_url: 'https://digiscore.agency/docs/sample.pdf',
    file_size: 2500000,
    file_type: 'application/pdf',
    client_name: clients[0]?.name || ''
  });

  const categories: DocumentCategory[] = [
    'Contracts',
    'Client Documents',
    'Agreements',
    'Quotations',
    'Invoices',
    'Employee Documents',
    'Company Documents',
    'Project Files'
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = categoryFilter === 'All' || doc.category === categoryFilter;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.client_name && doc.client_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title) return;
    addDocument(uploadForm);
    setIsUploadOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-fuchsia-400" />
            Centralized Document Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Secure agency cloud storage for trade licenses, contracts, NDA agreements, and client creative files.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by name, client, or filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setCategoryFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              categoryFilter === 'All' ? 'bg-fuchsia-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Files ({documents.length})
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                categoryFilter === c ? 'bg-fuchsia-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="rounded-2xl glass-panel border border-slate-800 p-5 space-y-4 hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{doc.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold mt-1 inline-block">
                    {doc.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-400">
              <p className="font-mono text-[11px] text-slate-300 truncate">{doc.file_name}</p>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span>{doc.client_name || 'DIGI SCORE Official'}</span>
                <span>{(doc.file_size / 1024 / 1024).toFixed(1)} MB</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">{formatDate(doc.created_at)}</span>
              <div className="flex items-center gap-1.5">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="View / Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete File"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Document"
        subtitle="Save agency contract, quotation, or client deliverable file"
        maxWidth="md"
      >
        <form onSubmit={handleSaveUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title *</label>
            <input
              type="text"
              required
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              placeholder="e.g. Master Retainer Contract 2026"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as DocumentCategory })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Associated Client</label>
              <select
                value={uploadForm.client_name}
                onChange={(e) => setUploadForm({ ...uploadForm, client_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                <option value="DIGI SCORE Internal">DIGI SCORE Internal</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">File Name</label>
            <input
              type="text"
              value={uploadForm.file_name}
              onChange={(e) => setUploadForm({ ...uploadForm, file_name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow"
            >
              Upload Document
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
