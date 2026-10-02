import {
  UserRole,
  UserAccount,
  CustomRoleDefinition,
  RolePermissions,
  ModuleKey,
  PermissionAction,
  DashboardWidgetKey,
  UserActivityLog,
  LoginActivity
} from '../types';

export const ALL_MODULES: { key: ModuleKey; label: string; group: string }[] = [
  { key: 'dashboard', label: 'Executive Dashboard', group: 'Core' },
  { key: 'crm', label: 'CRM Overview', group: 'CRM' },
  { key: 'leads', label: 'Leads Management', group: 'CRM' },
  { key: 'followups', label: 'Follow-ups', group: 'CRM' },
  { key: 'deals', label: 'Deals & Opportunities', group: 'CRM' },
  { key: 'pipeline', label: 'Sales Pipeline (Kanban)', group: 'CRM' },
  { key: 'clients', label: 'Client Accounts', group: 'Clients' },
  { key: 'companies', label: 'Companies Directory', group: 'Clients' },
  { key: 'sales', label: 'Sales Operations', group: 'Sales' },
  { key: 'quotations', label: 'Quotations & Proposals', group: 'Sales' },
  { key: 'invoices', label: 'Tax Invoices', group: 'Sales' },
  { key: 'payments', label: 'Payment Settlements', group: 'Sales' },
  { key: 'projects', label: 'Project Management', group: 'Delivery' },
  { key: 'tasks', label: 'Tasks & Sprints', group: 'Delivery' },
  { key: 'content', label: 'Content Studio', group: 'Content' },
  { key: 'content_approval', label: 'Content Approval Workflow', group: 'Content' },
  { key: 'finance', label: 'Finance & P&L', group: 'Finance' },
  { key: 'expenses', label: 'Expense Tracking', group: 'Finance' },
  { key: 'hr', label: 'HR Management', group: 'People' },
  { key: 'employees', label: 'Employee Directory', group: 'People' },
  { key: 'attendance', label: 'Biometric Attendance', group: 'People' },
  { key: 'leave', label: 'Leave Requests', group: 'People' },
  { key: 'salary', label: 'Payroll & Salary Slips', group: 'People' },
  { key: 'documents', label: 'Document Vault', group: 'Assets' },
  { key: 'communication', label: 'Omnichannel Log', group: 'Communication' },
  { key: 'reports', label: 'BI Analytics & Reports', group: 'Analytics' },
  { key: 'settings', label: 'System & Agency Settings', group: 'System' },
  { key: 'users', label: 'User & Role Access Control', group: 'System' }
];

export const ALL_ACTIONS: { key: PermissionAction; label: string }[] = [
  { key: 'view', label: 'View' },
  { key: 'create', label: 'Create' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
  { key: 'approve', label: 'Approve' },
  { key: 'export', label: 'Export' }
];

export const ALL_WIDGETS: { key: DashboardWidgetKey; label: string; desc: string; category: string }[] = [
  { key: 'total_leads', label: 'Total Leads KPI', desc: 'Agency wide lead count and volume metrics', category: 'Growth' },
  { key: 'my_leads', label: 'My Assigned Leads', desc: 'Directly assigned inbound prospects', category: 'Growth' },
  { key: 'followups', label: 'Today\'s Follow-ups', desc: 'Scheduled calls and meetings due today', category: 'Growth' },
  { key: 'sales_pipeline', label: 'Sales Pipeline Summary', desc: 'Kanban stages and deal revenue values', category: 'Growth' },
  { key: 'active_clients', label: 'Active Retainer Clients', desc: 'Client account metrics and MRR status', category: 'Clients' },
  { key: 'my_projects', label: 'My Active Projects', desc: 'Deliverable sprint progress and deadlines', category: 'Delivery' },
  { key: 'my_tasks', label: 'My Assigned Tasks', desc: 'Pending to-do and in-progress tasks', category: 'Delivery' },
  { key: 'overdue_tasks', label: 'Overdue Task Alert Bar', desc: 'Tasks that breached SLA delivery deadlines', category: 'Delivery' },
  { key: 'content_calendar', label: 'Monthly Content Deliverables', desc: 'Posts, Reels, and Carousels quota count', category: 'Creative' },
  { key: 'pending_approvals', label: 'Pending Approvals Queue', desc: 'Deliverables awaiting internal / client sign-off', category: 'Creative' },
  { key: 'revenue', label: 'Monthly Revenue Cash Flow', desc: 'Gross agency collections and growth curves', category: 'Finance' },
  { key: 'pending_payments', label: 'Pending Receivables', desc: 'Unpaid client invoice balances', category: 'Finance' },
  { key: 'expenses', label: 'Monthly Burn & Expenses', desc: 'Operational disbursements & vendor bills', category: 'Finance' },
  { key: 'attendance', label: 'Biometric Attendance Punch', desc: 'Daily punch in/out timer and status', category: 'Operations' },
  { key: 'leave_balance', label: 'Leave Balance & Status', desc: 'Annual leave accrual and pending requests', category: 'Operations' },
  { key: 'salary', label: 'My Salary & Payslip', desc: 'Net compensation and salary breakdown', category: 'Finance' },
  { key: 'notifications', label: 'Live Notifications Feed', desc: 'Real-time alert notices and mentions', category: 'System' },
  { key: 'recent_activities', label: 'Recent Agency Activities', desc: 'System-wide audit feed of client & deal events', category: 'System' }
];

export const SYSTEM_ROLES: CustomRoleDefinition[] = [
  { id: 'r-super', key: 'SUPER_ADMIN', name: 'Super Admin', description: 'Complete unrestricted ownership over all agency systems, users and settings', is_system: true, created_at: '2026-01-01' },
  { id: 'r-admin', key: 'ADMIN', name: 'Admin', description: 'Operational agency management, staff coordination and financials', is_system: true, created_at: '2026-01-01' },
  { id: 'r-mgr', key: 'MANAGER', name: 'Project / Team Manager', description: 'Team execution, project delivery oversight and client approvals', is_system: true, created_at: '2026-01-01' },
  { id: 'r-sales', key: 'SALES', name: 'Sales Executive', description: 'Lead acquisition, deals, pipeline negotiations and quotations', is_system: true, created_at: '2026-01-01' },
  { id: 'r-acc', key: 'ACCOUNTANT', name: 'Accountant / Financial Controller', description: 'Invoices, payment settlements, expenses, P&L and payroll', is_system: true, created_at: '2026-01-01' },
  { id: 'r-des', key: 'DESIGNER', name: 'Graphic / Visual Designer', description: 'Posters, social carousels, ad banners and brand identity tasks', is_system: true, created_at: '2026-01-01' },
  { id: 'r-vid', key: 'VIDEO_EDITOR', name: 'Video Producer & Editor', description: 'Short-form reels, motion graphics, video cutting and grading', is_system: true, created_at: '2026-01-01' },
  { id: 'r-mktg', key: 'MARKETING_EXECUTIVE', name: 'Performance Media Buyer', description: 'Meta & Google ad campaigns, SEO growth and conversion reporting', is_system: true, created_at: '2026-01-01' },
  { id: 'r-dev', key: 'DEVELOPER', name: 'Software / Web Developer', description: 'Web development, web apps, technical maintenance and integrations', is_system: true, created_at: '2026-01-01' },
  { id: 'r-hr', key: 'HR', name: 'People & HR Manager', description: 'Staff records, biometric attendance, leave approvals and payroll dispatch', is_system: true, created_at: '2026-01-01' },
  { id: 'r-emp', key: 'EMPLOYEE', name: 'Agency Employee', description: 'Individual task execution, attendance punching and leave submission', is_system: true, created_at: '2026-01-01' },
  { id: 'r-cli', key: 'CLIENT', name: 'Client Portal User', description: 'External client access to approve deliverables, view invoices and project milestones', is_system: true, created_at: '2026-01-01' }
];

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-1',
    full_name: 'Hamid Saneen',
    email: 'admin@digiscore.demo',
    password: 'password123',
    phone: '+91 98470 12345',
    role_key: 'SUPER_ADMIN',
    department: 'Executive & Management',
    designation: 'Managing Director & CEO',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
    status: 'Active',
    joining_date: '2024-01-01',
    last_login: 'Just now',
    created_at: '2024-01-01'
  },
  {
    id: 'usr-2',
    full_name: 'Sarah Al-Hashemi',
    email: 'manager@digiscore.demo',
    password: 'password123',
    phone: '+91 98470 23456',
    role_key: 'MANAGER',
    department: 'Creative & Design',
    designation: 'Head of Creative Operations',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    status: 'Active',
    joining_date: '2024-04-15',
    last_login: '2 hours ago',
    created_at: '2024-04-15'
  },
  {
    id: 'usr-3',
    full_name: 'Tariq Mansoor',
    email: 'sales@digiscore.demo',
    password: 'password123',
    phone: '+91 98470 34567',
    role_key: 'SALES',
    department: 'Sales & Growth',
    designation: 'Senior Growth & Sales Lead',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    status: 'Active',
    joining_date: '2024-03-01',
    last_login: '4 hours ago',
    created_at: '2024-03-01'
  },
  {
    id: 'usr-4',
    full_name: 'Maya Lin',
    email: 'designer@digiscore.demo',
    password: 'password123',
    phone: '+91 98470 45678',
    role_key: 'DESIGNER',
    department: 'Creative & Design',
    designation: 'Senior Brand & Visual Designer',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    status: 'Active',
    joining_date: '2024-09-01',
    last_login: 'Yesterday',
    created_at: '2024-09-01'
  },
  {
    id: 'usr-5',
    full_name: 'Rayyan Khan',
    email: 'video@digiscore.demo',
    password: 'password123',
    phone: '+91 98470 56789',
    role_key: 'VIDEO_EDITOR',
    department: 'Video & Motion',
    designation: 'Lead Video Producer & Motion Designer',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    status: 'Active',
    joining_date: '2024-05-20',
    last_login: '1 day ago',
    created_at: '2024-05-20'
  },
  {
    id: 'usr-6',
    full_name: 'Elena Vasiliev',
    email: 'marketing@digiscore.demo',
    password: 'password123',
    phone: '+91 98470 67890',
    role_key: 'MARKETING_EXECUTIVE',
    department: 'Digital Marketing & Ads',
    designation: 'Performance Media Buyer (Meta & Google)',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    status: 'Active',
    joining_date: '2024-06-01',
    last_login: '3 days ago',
    created_at: '2024-06-01'
  },
  {
    id: 'usr-7',
    full_name: 'Fatima Zahra',
    email: 'accountant@digiscore.demo',
    password: 'password123',
    phone: '+91 98470 78901',
    role_key: 'ACCOUNTANT',
    department: 'Finance & Accounts',
    designation: 'Senior Financial Controller',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    status: 'Active',
    joining_date: '2024-08-01',
    last_login: 'Yesterday',
    created_at: '2024-08-01'
  },
  {
    id: 'usr-8',
    full_name: 'Zainab Rashid',
    email: 'hr@digiscore.demo',
    password: 'password123',
    phone: '+91 98470 89012',
    role_key: 'HR',
    department: 'People & HR',
    designation: 'Head of People & Operations',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    status: 'Active',
    joining_date: '2024-08-15',
    last_login: '2 days ago',
    created_at: '2024-08-15'
  },
  {
    id: 'usr-9',
    full_name: 'Kareem Farooq',
    email: 'employee@digiscore.demo',
    password: 'password123',
    phone: '+91 98470 90123',
    role_key: 'EMPLOYEE',
    department: 'Technology & Dev',
    designation: 'Full Stack Engineer',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    status: 'Active',
    joining_date: '2024-07-15',
    last_login: '5 hours ago',
    created_at: '2024-07-15'
  },
  {
    id: 'usr-10',
    full_name: 'Dr. Faisal Al-Sabah',
    email: 'client@digiscore.demo',
    password: 'password123',
    phone: '+91 98470 01234',
    role_key: 'CLIENT',
    department: 'External Client',
    designation: 'Director, 360 Turning Point',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    status: 'Active',
    joining_date: '2025-08-01',
    last_login: 'Today',
    created_at: '2025-08-01'
  },
  {
    id: 'usr-11',
    full_name: 'Zayn Malik',
    email: 'zayn@digiscore.demo',
    password: 'password123',
    phone: '+91 98470 11223',
    role_key: 'EMPLOYEE',
    department: 'Creative & Operations',
    designation: 'Motion & Visual Associate',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    status: 'Active',
    joining_date: '2024-10-01',
    last_login: 'Yesterday',
    created_at: '2024-10-01'
  }
];

export const DEFAULT_ROLE_WIDGETS: Record<string, DashboardWidgetKey[]> = {
  SUPER_ADMIN: [
    'revenue',
    'pending_payments',
    'expenses',
    'total_leads',
    'sales_pipeline',
    'active_clients',
    'my_projects',
    'my_tasks',
    'overdue_tasks',
    'content_calendar',
    'pending_approvals',
    'attendance',
    'notifications',
    'recent_activities'
  ],
  ADMIN: [
    'active_clients',
    'total_leads',
    'my_projects',
    'my_tasks',
    'overdue_tasks',
    'content_calendar',
    'sales_pipeline',
    'revenue',
    'notifications',
    'recent_activities'
  ],
  MANAGER: [
    'my_projects',
    'my_tasks',
    'overdue_tasks',
    'active_clients',
    'content_calendar',
    'pending_approvals',
    'attendance',
    'notifications',
    'recent_activities'
  ],
  SALES: [
    'my_leads',
    'total_leads',
    'followups',
    'sales_pipeline',
    'active_clients',
    'my_tasks',
    'notifications',
    'recent_activities'
  ],
  DESIGNER: [
    'my_tasks',
    'overdue_tasks',
    'content_calendar',
    'pending_approvals',
    'my_projects',
    'notifications',
    'recent_activities'
  ],
  VIDEO_EDITOR: [
    'my_tasks',
    'overdue_tasks',
    'content_calendar',
    'pending_approvals',
    'my_projects',
    'notifications',
    'recent_activities'
  ],
  MARKETING_EXECUTIVE: [
    'total_leads',
    'my_leads',
    'active_clients',
    'content_calendar',
    'my_tasks',
    'notifications',
    'recent_activities'
  ],
  ACCOUNTANT: [
    'revenue',
    'pending_payments',
    'expenses',
    'salary',
    'notifications',
    'recent_activities'
  ],
  HR: [
    'attendance',
    'leave_balance',
    'salary',
    'notifications',
    'recent_activities'
  ],
  EMPLOYEE: [
    'my_tasks',
    'my_projects',
    'attendance',
    'leave_balance',
    'salary',
    'notifications',
    'recent_activities'
  ],
  DEVELOPER: [
    'my_tasks',
    'my_projects',
    'overdue_tasks',
    'attendance',
    'notifications',
    'recent_activities'
  ],
  CLIENT: [
    'my_projects',
    'content_calendar',
    'pending_approvals',
    'pending_payments',
    'notifications'
  ]
};

// Helper to generate full permission record
const fullPermissions = (): Record<PermissionAction, boolean> => ({
  view: true,
  create: true,
  edit: true,
  delete: true,
  approve: true,
  export: true
});

const viewOnlyPermissions = (): Record<PermissionAction, boolean> => ({
  view: true,
  create: false,
  edit: false,
  delete: false,
  approve: false,
  export: true
});

const noPermissions = (): Record<PermissionAction, boolean> => ({
  view: false,
  create: false,
  edit: false,
  delete: false,
  approve: false,
  export: false
});

export const generateDefaultRolePermissions = (role: string): RolePermissions => {
  const result: any = {};
  ALL_MODULES.forEach(m => {
    result[m.key] = noPermissions();
  });

  if (role === 'SUPER_ADMIN') {
    ALL_MODULES.forEach(m => {
      result[m.key] = fullPermissions();
    });
    return result;
  }

  if (role === 'ADMIN') {
    ALL_MODULES.forEach(m => {
      result[m.key] = fullPermissions();
    });
    result.settings.delete = false;
    result.users.delete = false;
    return result;
  }

  if (role === 'MANAGER') {
    result.dashboard = viewOnlyPermissions();
    result.clients = { ...viewOnlyPermissions(), edit: true, export: true };
    result.companies = viewOnlyPermissions();
    result.projects = { ...fullPermissions(), delete: false };
    result.tasks = { ...fullPermissions(), delete: false };
    result.content = fullPermissions();
    result.content_approval = fullPermissions();
    result.documents = { ...fullPermissions(), delete: false };
    result.communication = { ...fullPermissions(), delete: false };
    result.reports = viewOnlyPermissions();
    result.notifications = fullPermissions();
    return result;
  }

  if (role === 'SALES') {
    result.dashboard = viewOnlyPermissions();
    result.crm = fullPermissions();
    result.leads = fullPermissions();
    result.followups = fullPermissions();
    result.deals = fullPermissions();
    result.pipeline = fullPermissions();
    result.clients = { view: true, create: true, edit: true, delete: false, approve: false, export: true };
    result.companies = { view: true, create: true, edit: true, delete: false, approve: false, export: true };
    result.sales = { view: true, create: true, edit: true, delete: false, approve: false, export: true };
    result.quotations = fullPermissions();
    result.invoices = viewOnlyPermissions();
    result.payments = viewOnlyPermissions();
    result.communication = fullPermissions();
    result.documents = { view: true, create: true, edit: false, delete: false, approve: false, export: true };
    result.notifications = fullPermissions();
    return result;
  }

  if (role === 'ACCOUNTANT') {
    result.dashboard = viewOnlyPermissions();
    result.sales = fullPermissions();
    result.invoices = fullPermissions();
    result.payments = fullPermissions();
    result.quotations = viewOnlyPermissions();
    result.finance = fullPermissions();
    result.expenses = fullPermissions();
    result.salary = fullPermissions();
    result.reports = fullPermissions();
    result.documents = { view: true, create: true, edit: false, delete: false, approve: false, export: true };
    result.communication = fullPermissions();
    result.notifications = fullPermissions();
    return result;
  }

  if (role === 'DESIGNER' || role === 'VIDEO_EDITOR') {
    result.dashboard = viewOnlyPermissions();
    result.content = { view: true, create: true, edit: true, delete: false, approve: true, export: true };
    result.content_approval = { view: true, create: false, edit: true, delete: false, approve: false, export: false };
    result.projects = viewOnlyPermissions();
    result.tasks = { view: true, create: true, edit: true, delete: false, approve: false, export: false };
    result.documents = { view: true, create: true, edit: false, delete: false, approve: false, export: true };
    result.communication = fullPermissions();
    result.notifications = fullPermissions();
    return result;
  }

  if (role === 'MARKETING_EXECUTIVE') {
    result.dashboard = viewOnlyPermissions();
    result.crm = viewOnlyPermissions();
    result.leads = { view: true, create: true, edit: true, delete: false, approve: false, export: true };
    result.followups = { view: true, create: true, edit: true, delete: false, approve: false, export: true };
    result.pipeline = viewOnlyPermissions();
    result.clients = viewOnlyPermissions();
    result.content = fullPermissions();
    result.content_approval = fullPermissions();
    result.reports = fullPermissions();
    result.documents = { view: true, create: true, edit: false, delete: false, approve: false, export: true };
    result.communication = fullPermissions();
    result.notifications = fullPermissions();
    return result;
  }

  if (role === 'HR') {
    result.dashboard = viewOnlyPermissions();
    result.hr = fullPermissions();
    result.employees = fullPermissions();
    result.attendance = fullPermissions();
    result.leave = fullPermissions();
    result.salary = fullPermissions();
    result.documents = fullPermissions();
    result.communication = fullPermissions();
    result.reports = { view: true, create: false, edit: false, delete: false, approve: false, export: true };
    result.notifications = fullPermissions();
    return result;
  }

  if (role === 'EMPLOYEE' || role === 'DEVELOPER') {
    result.dashboard = viewOnlyPermissions();
    result.projects = viewOnlyPermissions();
    result.tasks = { view: true, create: true, edit: true, delete: false, approve: false, export: false };
    result.documents = viewOnlyPermissions();
    result.communication = { view: true, create: true, edit: false, delete: false, approve: false, export: false };
    result.notifications = fullPermissions();
    return result;
  }

  if (role === 'CLIENT') {
    result.projects = viewOnlyPermissions();
    result.content = { view: true, create: false, edit: false, delete: false, approve: true, export: false };
    result.content_approval = { view: true, create: false, edit: false, delete: false, approve: true, export: false };
    result.invoices = viewOnlyPermissions();
    result.payments = viewOnlyPermissions();
    result.documents = viewOnlyPermissions();
    result.communication = { view: true, create: true, edit: false, delete: false, approve: false, export: false };
    result.notifications = fullPermissions();
    return result;
  }

  return result;
};

export const INITIAL_USER_ACTIVITY_LOGS: UserActivityLog[] = [];

export const INITIAL_LOGIN_ACTIVITIES: LoginActivity[] = [];
