import React, { useState } from 'react';
import {
  Users,
  Target,
  Clock,
  Briefcase,
  CheckCircle2,
  Building2,
  FolderGit2,
  CheckSquare,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Receipt,
  ReceiptText,
  PieChart,
  UserCheck,
  ArrowUpRight,
  ExternalLink,
  Calendar,
  Sparkles,
  PlaneTakeoff,
  Banknote,
  Bell,
  ShieldCheck,
  Layers,
  ArrowRight,
  RotateCcw,
  Check
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { StatCard } from '../../common/StatCard';
import { StatusBadge } from '../../common/StatusBadge';
import { StaffPunchConsole } from '../../common/StaffPunchConsole';
import { formatCurrency, formatDate } from '../../../lib/utils';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface DashboardProps {
  onNavigate: (module: string) => void;
  onOpenQuickAdd: (type: 'lead' | 'task' | 'content' | 'invoice' | 'expense') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenQuickAdd }) => {
  const { currentUser, role, hasWidget, hasPermission } = useAuth();
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastRefreshed(new Date());
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };
  const {
    leads,
    deals,
    clients,
    projects,
    tasks,
    invoices,
    payments,
    expenses,
    attendance,
    employees,
    contentItems,
    communications,
    salaries
  } = useData();

  // Filter personal data based on user
  const userFullName = currentUser?.full_name || 'Team Member';

  // Leads
  const myLeads = leads.filter(
    (l) => l.assigned_salesperson_id === currentUser?.id || l.notes?.includes(userFullName)
  );
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'New').length;
  const followupsToday = leads.filter((l) => l.next_followup_at).length;

  // Deals
  const openDeals = deals.filter((d) => !['Won', 'Lost'].includes(d.stage)).length;
  const wonDeals = deals.filter((d) => d.stage === 'Won').length;

  // Clients & Projects
  const activeClients = clients.filter((c) => c.status === 'Active').length;
  const activeProjects = projects.filter((p) => p.status === 'Active').length;
  const myProjects = projects.filter(
    (p) =>
      p.project_manager_name === userFullName ||
      (p.team_members && p.team_members.some((m) => m.toLowerCase().includes(userFullName.toLowerCase())))
  );

  // Tasks
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;
  const myTasks = tasks.filter(
    (t) =>
      t.assigned_to_name?.toLowerCase().includes(userFullName.toLowerCase()) ||
      t.title.toLowerCase().includes(userFullName.toLowerCase())
  );
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'Completed' && new Date(t.due_date) < new Date()
  ).length;

  // Content
  const pendingApprovals = contentItems.filter(
    (c) => ['Client Approval', 'Internal Review', 'Designing'].includes(c.status)
  );

  // Finance
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
  const pendingReceivables = invoices.reduce((acc, inv) => acc + inv.balance, 0);
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  // User's own salary
  const userSalaryRecord = salaries.find(
    (s) => s.employee_name.toLowerCase().includes(userFullName.toLowerCase())
  );

  // Financial Chart Data (Reflects live ledger values)
  const financialTrendData = [
    { month: 'Start', revenue: 0, expenses: 0, profit: 0 },
    { month: 'Current Period', revenue: totalRevenue, expenses: totalExpenses, profit: netProfit }
  ];

  // Pipeline distribution
  const pipelineData = [
    { name: 'New Lead', count: deals.filter((d) => d.stage === 'New Lead').length, fill: '#8B5CF6' },
    { name: 'Contacted', count: deals.filter((d) => d.stage === 'Contacted').length, fill: '#A855F7' },
    { name: 'Qualified', count: deals.filter((d) => d.stage === 'Qualified').length, fill: '#EC4899' },
    { name: 'Meeting', count: deals.filter((d) => d.stage === 'Meeting').length, fill: '#3B82F6' },
    { name: 'Proposal', count: deals.filter((d) => d.stage === 'Proposal').length, fill: '#06B6D4' },
    { name: 'Negotiation', count: deals.filter((d) => d.stage === 'Negotiation').length, fill: '#F59E0B' },
    { name: 'Won', count: deals.filter((d) => d.stage === 'Won').length, fill: '#10B981' }
  ];

  const projectStatusData = [
    { name: 'Active', value: projects.filter((p) => p.status === 'Active').length, color: '#8B5CF6' },
    { name: 'Review', value: projects.filter((p) => p.status === 'Review').length, color: '#EC4899' },
    { name: 'Planning', value: projects.filter((p) => p.status === 'Planning').length, color: '#3B82F6' },
    { name: 'Completed', value: projects.filter((p) => p.status === 'Completed').length, color: '#10B981' }
  ];

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/60 via-slate-900/90 to-slate-900 border border-purple-500/20 p-6 sm:p-8 backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{role.replace('_', ' ')} WORKSPACE</span>
              <span className="text-slate-400">• {currentUser?.department || 'Digital Operations'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">{currentUser?.full_name || 'Admin'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {role === 'SUPER_ADMIN' && 'Full agency executive control. Financial velocity, sales pipelines, client retainers, and workforce metrics.'}
              {role === 'MANAGER' && 'Project delivery sprint board, team task velocity, and pending deliverable sign-offs.'}
              {role === 'SALES' && 'Pipeline revenue, active prospect negotiations, quotation updates, and follow-up schedules.'}
              {role === 'DESIGNER' && 'Creative design queue, client feedback revisions, and monthly calendar deliverable targets.'}
              {role === 'VIDEO_EDITOR' && 'Short-form reels production, motion graphics queue, and timeline milestones.'}
              {role === 'ACCOUNTANT' && 'Cash flow management, GST invoice settlements, ledger disbursements, and profit margins.'}
              {role === 'HR' && 'Team directory, biometric punch records, leave applications, and monthly payroll disbursements.'}
              {role === 'EMPLOYEE' && 'Your personal assignment queue, daily punch console, and task milestone tracking.'}
              {role === 'MARKETING_EXECUTIVE' && 'Performance ad campaigns, conversion tracking, keyword ranks, and client lead volume.'}
            </p>
          </div>

          {/* Quick Action Buttons per role */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Refresh Button */}
            <button
              onClick={handleRefresh}
              className="px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 font-semibold text-xs hover:text-white hover:border-fuchsia-500/50 hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
              title="Click to recalculate and refresh live metrics"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-fuchsia-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Updating...' : 'Live Refreshed'}</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </button>

            {hasPermission('leads', 'create') && (
              <button
                onClick={() => onNavigate('crm-leads')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                <span>+ New Lead</span>
              </button>
            )}

            {hasPermission('tasks', 'create') && (
              <button
                onClick={() => onOpenQuickAdd('task')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-purple-300 font-semibold text-xs hover:bg-slate-800 transition-all flex items-center gap-1.5"
              >
                <span>+ New Task</span>
              </button>
            )}

            {hasPermission('invoices', 'view') && (
              <button
                onClick={() => onNavigate('sales-invoices')}
                className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-200 font-semibold text-xs hover:bg-slate-800 transition-all flex items-center gap-1.5"
              >
                <span>View Invoices</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Staff Attendance & Punch Console for all team members */}
      <StaffPunchConsole />

      {/* Overdue Task Alert Bar */}
      {hasWidget('overdue_tasks') && overdueTasks > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Attention Required: {overdueTasks} {overdueTasks === 1 ? 'task has' : 'tasks have'} passed delivery deadline!
              </p>
              <p className="text-[11px] text-rose-300">Review delayed milestones and re-allocate priorities on the Task Board.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('projects-tasks')}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-semibold text-xs hover:bg-rose-500 shrink-0"
          >
            Review Now
          </button>
        </div>
      )}

      {/* DYNAMIC KPI STAT CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Total Leads */}
        {hasWidget('total_leads') && (
          <StatCard
            title="Total Leads"
            value={totalLeads}
            change="+18%"
            isPositive={true}
            icon={<Users className="w-4 h-4" />}
            subtitle="Pipeline active"
            gradient="purple"
            onClick={() => onNavigate('crm-leads')}
          />
        )}

        {/* My Leads */}
        {hasWidget('my_leads') && (
          <StatCard
            title="My Assigned Leads"
            value={myLeads.length || totalLeads}
            icon={<Target className="w-4 h-4" />}
            subtitle="Personal accounts"
            gradient="pink"
            onClick={() => onNavigate('crm-leads')}
          />
        )}

        {/* Follow-ups */}
        {hasWidget('followups') && (
          <StatCard
            title="Today's Follow-ups"
            value={followupsToday}
            icon={<Clock className="w-4 h-4" />}
            subtitle="Calls & DMs due"
            gradient="blue"
            onClick={() => onNavigate('crm-followups')}
          />
        )}

        {/* Sales Pipeline */}
        {hasWidget('sales_pipeline') && (
          <>
            <StatCard
              title="Open Deals"
              value={openDeals}
              icon={<Briefcase className="w-4 h-4" />}
              subtitle="In negotiation"
              gradient="purple"
              onClick={() => onNavigate('crm-pipeline')}
            />
            <StatCard
              title="Won Deals"
              value={wonDeals}
              change="Closed"
              isPositive={true}
              icon={<CheckCircle2 className="w-4 h-4" />}
              subtitle="Converted to client"
              gradient="emerald"
              onClick={() => onNavigate('crm-pipeline')}
            />
          </>
        )}

        {/* Active Clients */}
        {hasWidget('active_clients') && (
          <StatCard
            title="Active Clients"
            value={activeClients}
            change="+2 this mo"
            isPositive={true}
            icon={<Building2 className="w-4 h-4" />}
            subtitle="Monthly retainers"
            gradient="purple"
            onClick={() => onNavigate('clients-all')}
          />
        )}

        {/* My Projects */}
        {hasWidget('my_projects') && (
          <StatCard
            title={role === 'SUPER_ADMIN' || role === 'ADMIN' ? 'Active Projects' : 'My Projects'}
            value={role === 'SUPER_ADMIN' || role === 'ADMIN' ? activeProjects : (myProjects.length || activeProjects)}
            icon={<FolderGit2 className="w-4 h-4" />}
            subtitle="Sprint active"
            gradient="blue"
            onClick={() => onNavigate('projects-list')}
          />
        )}

        {/* My Tasks */}
        {hasWidget('my_tasks') && (
          <StatCard
            title={role === 'SUPER_ADMIN' || role === 'ADMIN' ? 'Pending Tasks' : 'My Active Tasks'}
            value={role === 'SUPER_ADMIN' || role === 'ADMIN' ? pendingTasks : (myTasks.length || pendingTasks)}
            icon={<CheckSquare className="w-4 h-4" />}
            subtitle="To Do / In Progress"
            gradient="pink"
            onClick={() => onNavigate('projects-tasks')}
          />
        )}

        {/* Revenue */}
        {hasWidget('revenue') && (
          <StatCard
            title="Gross Revenue"
            value={formatCurrency(totalRevenue)}
            change="+24% YoY"
            isPositive={true}
            icon={<DollarSign className="w-4 h-4" />}
            subtitle="Inflow collections"
            gradient="emerald"
            onClick={() => onNavigate('finance-revenue')}
          />
        )}

        {/* Pending Payments */}
        {hasWidget('pending_payments') && (
          <StatCard
            title="Pending Receivables"
            value={formatCurrency(pendingReceivables)}
            icon={<Receipt className="w-4 h-4" />}
            subtitle="Unsettled invoices"
            gradient="pink"
            onClick={() => onNavigate('sales-invoices')}
          />
        )}

        {/* Expenses */}
        {hasWidget('expenses') && (
          <StatCard
            title="Monthly Burn"
            value={formatCurrency(totalExpenses)}
            change="-4% vs Budget"
            isPositive={true}
            icon={<ReceiptText className="w-4 h-4" />}
            subtitle="Agency disbursements"
            gradient="pink"
            onClick={() => onNavigate('finance-expenses')}
          />
        )}

        {/* Attendance */}
        {hasWidget('attendance') && (
          <StatCard
            title="Daily Attendance"
            value={`${attendance.filter((a) => a.status === 'Present').length} / ${employees.length}`}
            icon={<UserCheck className="w-4 h-4" />}
            subtitle="Punch in status"
            gradient="blue"
            onClick={() => onNavigate('hr-attendance')}
          />
        )}

        {/* Salary */}
        {hasWidget('salary') && userSalaryRecord && (
          <StatCard
            title="Net Compensation"
            value={formatCurrency(userSalaryRecord.net_salary)}
            icon={<Banknote className="w-4 h-4" />}
            subtitle={`Status: ${userSalaryRecord.payment_status}`}
            gradient="emerald"
            onClick={() => onNavigate('hr-salary')}
          />
        )}
      </div>

      {/* CHARTS SECTION */}
      {(hasWidget('revenue') || hasWidget('sales_pipeline') || hasWidget('content_calendar') || hasWidget('my_projects')) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          {hasWidget('revenue') && (
            <div className="lg:col-span-2 rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Monthly Cash Flow & Profit Velocity</h3>
                  <p className="text-xs text-slate-400">Revenue inflows vs Operational disbursements (₹ INR)</p>
                </div>
                <button
                  onClick={() => onNavigate('finance-revenue')}
                  className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-medium flex items-center gap-1"
                >
                  <span>Finance Studio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financialTrendData}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EC4899" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#EC4899" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                      formatter={(val: any) => formatCurrency(Number(val))}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="revenue" name="Inflow Revenue" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#revenueGrad)" />
                    <Area type="monotone" dataKey="expenses" name="Expenditures" stroke="#EC4899" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Sales Pipeline Bar Chart */}
          {hasWidget('sales_pipeline') && !hasWidget('revenue') && (
            <div className="lg:col-span-2 rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Sales Pipeline Distribution</h3>
                  <p className="text-xs text-slate-400">Deal volume across negotiation funnel</p>
                </div>
                <button
                  onClick={() => onNavigate('crm-pipeline')}
                  className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-medium flex items-center gap-1"
                >
                  <span>Kanban Pipeline</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                    <Bar dataKey="count" name="Deals" radius={[6, 6, 0, 0]}>
                      {pipelineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Content Deliverable Quotas / Project Donut */}
          <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  {hasWidget('content_calendar') ? 'Monthly Content Quotas' : 'Project Breakdown'}
                </h3>
                <p className="text-xs text-slate-400">Deliverable status & quotas</p>
              </div>
              <button
                onClick={() => onNavigate(hasWidget('content_calendar') ? 'content-calendar' : 'projects-list')}
                className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-medium"
              >
                View Details
              </button>
            </div>

            {hasWidget('content_calendar') ? (
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-md bg-purple-500" />
                    <span className="text-xs font-semibold text-white">Brand Posters</span>
                  </div>
                  <span className="text-xs font-bold text-purple-300">12 / 16 Delivered</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-md bg-pink-500" />
                    <span className="text-xs font-semibold text-white">Short-form Reels</span>
                  </div>
                  <span className="text-xs font-bold text-pink-300">6 / 8 Delivered</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-md bg-blue-500" />
                    <span className="text-xs font-semibold text-white">Studio 4K Videos</span>
                  </div>
                  <span className="text-xs font-bold text-blue-300">2 / 2 Delivered</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-md bg-emerald-500" />
                    <span className="text-xs font-semibold text-white">Carousel Slides</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-300">4 / 4 Delivered</span>
                </div>
              </div>
            ) : (
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie data={projectStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DATA TABLES ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 1: Leads or My Tasks */}
        {hasWidget('my_tasks') ? (
          <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  {role === 'SUPER_ADMIN' || role === 'ADMIN' ? 'Recent Active Tasks' : 'My Assigned Tasks'}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('projects-tasks')}
                className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-semibold"
              >
                Open Kanban ({tasks.length})
              </button>
            </div>

            <div className="divide-y divide-slate-800/60">
              {(role === 'SUPER_ADMIN' || role === 'ADMIN' ? tasks.slice(0, 5) : (myTasks.length > 0 ? myTasks.slice(0, 5) : tasks.slice(0, 5))).map((t) => (
                <div key={t.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white truncate">{t.title}</span>
                      <StatusBadge status={t.status} />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      Client: {t.client_name} • Due: {formatDate(t.due_date)}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          hasWidget('total_leads') && (
            <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-pink-400" />
                  <h3 className="text-base font-bold text-white">High Priority Follow-ups & Leads</h3>
                </div>
                <button
                  onClick={() => onNavigate('crm-leads')}
                  className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-semibold"
                >
                  View All Leads ({leads.length})
                </button>
              </div>

              <div className="divide-y divide-slate-800/60">
                {leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white truncate">{lead.company}</span>
                        <StatusBadge status={lead.status} />
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        Contact: {lead.name} • {lead.interested_service || 'Full Agency Scope'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-fuchsia-300">{formatCurrency(lead.estimated_budget)}</span>
                      <p className="text-[10px] text-slate-500">{formatDate(lead.next_followup_at || lead.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* Table 2: Pending Approvals or Recent Receivables or Activities */}
        {hasWidget('pending_approvals') ? (
          <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <h3 className="text-base font-bold text-white">Creative Content Review Queue</h3>
              </div>
              <button
                onClick={() => onNavigate('content-approvals')}
                className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-semibold"
              >
                Approvals Board ({pendingApprovals.length})
              </button>
            </div>

            <div className="divide-y divide-slate-800/60">
              {pendingApprovals.slice(0, 5).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white truncate">{item.topic}</span>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {item.content_type} • Client: {item.client_name}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Due {formatDate(item.deadline)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : hasWidget('pending_payments') ? (
          <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Pending Client Invoices</h3>
              </div>
              <button
                onClick={() => onNavigate('sales-invoices')}
                className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-semibold"
              >
                Billing ({invoices.length})
              </button>
            </div>

            <div className="divide-y divide-slate-800/60">
              {invoices.filter((i) => i.balance > 0).slice(0, 5).map((inv) => (
                <div key={inv.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{inv.invoice_number}</span>
                      <StatusBadge status={inv.status} />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{inv.client_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">{formatCurrency(inv.balance)}</p>
                    <p className="text-[10px] text-slate-500">Due {formatDate(inv.due_date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Live Agency Activity Feed</h3>
              </div>
            </div>

            <div className="divide-y divide-slate-800/60">
              {communications.slice(0, 5).map((c) => (
                <div key={c.id} className="py-2.5 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-200 font-semibold">{c.subject}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{c.details}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {c.logged_by} • {formatDate(c.communicated_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
