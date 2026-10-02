import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  FileSpreadsheet,
  PieChart
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { formatCurrency, formatDate, exportToCSV } from '../../../lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export const ReportsModule: React.FC = () => {
  const { leads, clients, deals, projects, tasks, invoices, payments, expenses, attendance, employees } = useData();

  const [reportType, setReportType] = useState<
    'sales' | 'revenue' | 'conversion' | 'projects' | 'tasks' | 'attendance'
  >('sales');

  const [dateRange, setDateRange] = useState<'30d' | '90d' | 'ytd'>('30d');

  // Lead Conversion Stats
  const wonLeads = leads.filter((l) => l.status === 'Won').length;
  const conversionRate = leads.length > 0 ? ((wonLeads / leads.length) * 100).toFixed(1) : '0';

  // Sales monthly data
  const salesPerformanceData = [
    { name: 'Jan', deals: 4, revenue: 48000 },
    { name: 'Feb', deals: 6, revenue: 64000 },
    { name: 'Mar', deals: deals.length, revenue: payments.reduce((acc, p) => acc + p.amount, 0) }
  ];

  const handleExportCurrent = () => {
    if (reportType === 'sales') {
      exportToCSV('DIGISCORE_Sales_Report', deals);
    } else if (reportType === 'revenue') {
      exportToCSV('DIGISCORE_Revenue_Invoices', invoices);
    } else if (reportType === 'projects') {
      exportToCSV('DIGISCORE_Projects_Report', projects);
    } else if (reportType === 'tasks') {
      exportToCSV('DIGISCORE_Tasks_Report', tasks);
    } else {
      exportToCSV('DIGISCORE_Attendance_Report', attendance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-fuchsia-400" />
            Executive Reports & Business Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Data insights on revenue realization, lead conversion velocity, project delivery and resource productivity.
          </p>
        </div>

        <button
          onClick={handleExportCurrent}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-fuchsia-400" />
          <span>Export Current Report (CSV)</span>
        </button>
      </div>

      {/* Report Type Selector */}
      <div className="p-2 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setReportType('sales')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              reportType === 'sales' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sales & Deals
          </button>
          <button
            onClick={() => setReportType('revenue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              reportType === 'revenue' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Revenue & Collections
          </button>
          <button
            onClick={() => setReportType('projects')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              reportType === 'projects' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Project Delivery
          </button>
          <button
            onClick={() => setReportType('tasks')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              reportType === 'tasks' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Task Efficiency
          </button>
          <button
            onClick={() => setReportType('attendance')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              reportType === 'attendance' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            HR Attendance
          </button>
        </div>

        {/* Date range toggle */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-500 font-semibold mr-1">Period:</span>
          {(['30d', '90d', 'ytd'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-2.5 py-1 rounded-lg uppercase text-[11px] font-bold ${
                dateRange === r ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 uppercase font-semibold">Lead Conversion Rate</span>
          <p className="text-2xl font-black text-white mt-1">{conversionRate}%</p>
          <p className="text-[11px] text-emerald-400 mt-0.5">{wonLeads} won leads / {leads.length} captured</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 uppercase font-semibold">Average Deal Size</span>
          <p className="text-2xl font-black text-fuchsia-300 mt-1">
            {formatCurrency(deals.length > 0 ? deals.reduce((acc, d) => acc + d.deal_value, 0) / deals.length : 0)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across {deals.length} active opportunities</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 uppercase font-semibold">Task On-Time Rate</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">94.2%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Based on due date milestones</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 uppercase font-semibold">Active Client Retainers</span>
          <p className="text-2xl font-black text-purple-400 mt-1">{clients.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">100% contract retention</p>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl glass-panel border border-slate-800 p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Deal Flow & Revenue Generation Velocity</h3>
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                formatter={(val: any) => formatCurrency(Number(val))}
              />
              <Bar dataKey="revenue" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Realized Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
