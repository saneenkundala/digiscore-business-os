import React, { useState } from 'react';
import {
  Kanban,
  Plus,
  DollarSign,
  Briefcase,
  User,
  Calendar,
  Percent,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Trash2
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { Deal, DealStage } from '../../../types';
import { Modal } from '../../common/Modal';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { formatCurrency, formatDate } from '../../../lib/utils';
import confetti from 'canvas-confetti';

interface CRMPipelineProps {
  onNavigate: (module: string) => void;
}

export const CRMPipeline: React.FC<CRMPipelineProps> = ({ onNavigate }) => {
  const { deals, addDeal, updateDealStage, deleteDeal, employees } = useData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    deal_value: 15000,
    salesperson_name: 'Tariq Mansoor',
    stage: 'New Lead' as DealStage,
    probability: 30,
    expected_closing_date: '2026-03-31',
    notes: ''
  });

  const stages: DealStage[] = [
    'New Lead',
    'Contacted',
    'Qualified',
    'Meeting',
    'Proposal',
    'Negotiation',
    'Won',
    'Lost'
  ];

  // Pipeline summary calculations
  const totalPipelineValue = deals
    .filter((d) => !['Won', 'Lost'].includes(d.stage))
    .reduce((acc, d) => acc + d.deal_value, 0);

  const wonValue = deals
    .filter((d) => d.stage === 'Won')
    .reduce((acc, d) => acc + d.deal_value, 0);

  const lostValue = deals
    .filter((d) => d.stage === 'Lost')
    .reduce((acc, d) => acc + d.deal_value, 0);

  const expectedRevenue = deals
    .filter((d) => !['Won', 'Lost'].includes(d.stage))
    .reduce((acc, d) => acc + (d.deal_value * d.probability) / 100, 0);

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company_name) return;
    addDeal(formData);
    setIsAddModalOpen(false);
  };

  const handleAdvanceStage = (deal: Deal) => {
    const currentIndex = stages.indexOf(deal.stage);
    if (currentIndex < stages.length - 2) { // up to Won
      const nextStage = stages[currentIndex + 1];
      if (nextStage === 'Won') {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
      updateDealStage(deal.id, nextStage);
    }
  };

  const handleMarkWon = (deal: Deal) => {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    updateDealStage(deal.id, 'Won');
  };

  const handleMarkLost = (deal: Deal) => {
    updateDealStage(deal.id, 'Lost');
  };

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Kanban className="w-6 h-6 text-fuchsia-400" />
            Interactive Sales Pipeline Kanban
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visual pipeline health, weighted stage values and revenue projections.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Deal</span>
        </button>
      </div>

      {/* 4 Core Financial Pipeline Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-purple-500/20 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Pipeline</span>
          <p className="text-xl font-extrabold text-white mt-1">{formatCurrency(totalPipelineValue)}</p>
          <p className="text-[11px] text-purple-300 mt-0.5">Total unclosed deal volume</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-emerald-500/20 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Won Revenue</span>
          <p className="text-xl font-extrabold text-emerald-400 mt-1">{formatCurrency(wonValue)}</p>
          <p className="text-[11px] text-emerald-300 mt-0.5">Successfully signed contracts</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-fuchsia-500/20 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Expected Value</span>
          <p className="text-xl font-extrabold text-fuchsia-300 mt-1">{formatCurrency(expectedRevenue)}</p>
          <p className="text-[11px] text-fuchsia-400 mt-0.5">Weighted by stage probability</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-rose-500/20 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Lost Value</span>
          <p className="text-xl font-extrabold text-rose-400 mt-1">{formatCurrency(lostValue)}</p>
          <p className="text-[11px] text-rose-300 mt-0.5">Unclosed or disqualified deals</p>
        </div>
      </div>

      {/* Kanban Board Columns (Horizontal Scrolling) */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1400px]">
          {stages.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage);
            const stageTotal = stageDeals.reduce((acc, d) => acc + d.deal_value, 0);

            const stageBorderColors: Record<DealStage, string> = {
              'New Lead': 'border-purple-500/40',
              'Contacted': 'border-indigo-500/40',
              'Qualified': 'border-blue-500/40',
              'Meeting': 'border-fuchsia-500/40',
              'Proposal': 'border-pink-500/40',
              'Negotiation': 'border-amber-500/40',
              'Won': 'border-emerald-500/40',
              'Lost': 'border-rose-500/40'
            };

            return (
              <div
                key={stage}
                className="w-72 flex-shrink-0 flex flex-col rounded-2xl bg-slate-900/50 border border-slate-800 p-3"
              >
                {/* Column Header */}
                <div className={`pb-3 mb-3 border-b-2 ${stageBorderColors[stage]} flex items-center justify-between`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">{stage}</h4>
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center">
                        {stageDeals.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {formatCurrency(stageTotal)}
                    </p>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {stageDeals.length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-slate-800/80 rounded-xl text-slate-600 text-xs">
                      No deals in this stage
                    </div>
                  ) : (
                    stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="rounded-xl glass-panel p-3.5 border border-slate-800 hover:border-fuchsia-500/40 transition-all shadow-md group relative space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-semibold text-fuchsia-400">
                              {deal.deal_code}
                            </span>
                            <h5 className="text-xs font-bold text-white line-clamp-1">{deal.company_name}</h5>
                            <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">{deal.title}</p>
                          </div>
                          <button
                            onClick={() => {
                              setDealToDelete(deal);
                              setIsDeleteOpen(true);
                            }}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete Deal"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Deal Value & Probability */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                          <span className="font-extrabold text-emerald-400">
                            {formatCurrency(deal.deal_value)}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
                            {deal.probability}% win prob
                          </span>
                        </div>

                        {/* Salesperson & Date */}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-500" />
                            <span>{deal.salesperson_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>{formatDate(deal.expected_closing_date)}</span>
                          </div>
                        </div>

                        {/* Stage Mover Actions */}
                        {stage !== 'Won' && stage !== 'Lost' && (
                          <div className="flex items-center gap-1 pt-1.5 border-t border-slate-800/80">
                            <button
                              onClick={() => handleAdvanceStage(deal)}
                              className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-fuchsia-600/30 text-slate-300 hover:text-white text-[10px] font-semibold flex items-center justify-center gap-1 transition-all"
                              title="Advance to next pipeline stage"
                            >
                              <span>Advance</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMarkWon(deal)}
                              className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                              title="Mark Won"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMarkLost(deal)}
                              className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                              title="Mark Lost"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Deal Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Deal to Sales Pipeline"
        subtitle="Log a high-intent opportunity into the agency funnel"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateDeal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Client Name *</label>
            <input
              type="text"
              required
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              placeholder="e.g. Silk & Sand Luxury Resort"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Deal Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Ramadan Omnichannel Campaign & Reels"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Deal Value (₹ INR) *</label>
              <input
                type="number"
                required
                value={formData.deal_value}
                onChange={(e) => setFormData({ ...formData, deal_value: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Starting Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {stages.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Win Probability (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Closing Date</label>
              <input
                type="date"
                value={formData.expected_closing_date}
                onChange={(e) => setFormData({ ...formData, expected_closing_date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
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
              Create Deal
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          if (dealToDelete) deleteDeal(dealToDelete.id);
        }}
        title="Delete Deal"
        message={`Are you sure you want to delete deal "${dealToDelete?.title}"?`}
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  );
};
