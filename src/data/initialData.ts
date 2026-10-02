import {
  Department,
  Employee,
  Client,
  Company,
  Lead,
  LeadActivity,
  Followup,
  Deal,
  Service,
  Package,
  Project,
  Task,
  ContentItem,
  Quotation,
  Invoice,
  Payment,
  Expense,
  ExpenseCategory,
  AttendanceRecord,
  LeaveRequest,
  SalaryRecord,
  DocumentItem,
  CommunicationLog,
  SystemNotification
} from '../types';

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Executive & Management', code: 'EXEC', color: '#8B5CF6', created_at: '2026-01-01' },
  { id: 'd2', name: 'Sales & Growth', code: 'SALES', color: '#EC4899', created_at: '2026-01-01' },
  { id: 'd3', name: 'Creative & Design', code: 'DESIGN', color: '#6366F1', created_at: '2026-01-01' },
  { id: 'd4', name: 'Video & Motion', code: 'VIDEO', color: '#F43F5E', created_at: '2026-01-01' },
  { id: 'd5', name: 'Digital Marketing & Ads', code: 'MKTG', color: '#10B981', created_at: '2026-01-01' },
  { id: 'd6', name: 'Technology & Dev', code: 'TECH', color: '#3B82F6', created_at: '2026-01-01' },
  { id: 'd7', name: 'Finance & Accounts', code: 'FIN', color: '#F59E0B', created_at: '2026-01-01' },
  { id: 'd8', name: 'People & HR', code: 'HR', color: '#06B6D4', created_at: '2026-01-01' }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    employee_code: 'DS-001',
    first_name: 'Hamid',
    last_name: 'Saneen',
    email: 'hamid@digiscore.agency',
    phone: '+971 50 123 4567',
    role_title: 'Managing Director & CEO',
    department_id: 'd1',
    joining_date: '2024-01-10',
    salary: 28000,
    status: 'Active',
    emergency_contact: '+971 50 999 8888',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
    created_at: '2024-01-10'
  },
  {
    id: 'emp-2',
    employee_code: 'DS-002',
    first_name: 'Tariq',
    last_name: 'Mansoor',
    email: 'tariq@digiscore.agency',
    phone: '+971 55 987 6543',
    role_title: 'Head of Growth & Sales',
    department_id: 'd2',
    joining_date: '2024-03-01',
    salary: 16000,
    status: 'Active',
    emergency_contact: '+971 55 111 2233',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    created_at: '2024-03-01'
  },
  {
    id: 'emp-3',
    employee_code: 'DS-003',
    first_name: 'Sarah',
    last_name: 'Al-Hashemi',
    email: 'sarah@digiscore.agency',
    phone: '+971 52 444 3322',
    role_title: 'Senior Art Director',
    department_id: 'd3',
    joining_date: '2024-04-15',
    salary: 14500,
    status: 'Active',
    emergency_contact: '+971 52 777 6655',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    created_at: '2024-04-15'
  },
  {
    id: 'emp-4',
    employee_code: 'DS-004',
    first_name: 'Rayyan',
    last_name: 'Khan',
    email: 'rayyan@digiscore.agency',
    phone: '+971 58 333 9988',
    role_title: 'Lead Video Producer & Motion Designer',
    department_id: 'd4',
    joining_date: '2024-05-20',
    salary: 13000,
    status: 'Active',
    emergency_contact: '+971 58 444 1122',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    created_at: '2024-05-20'
  },
  {
    id: 'emp-5',
    employee_code: 'DS-005',
    first_name: 'Elena',
    last_name: 'Vasiliev',
    email: 'elena@digiscore.agency',
    phone: '+971 56 777 2211',
    role_title: 'Performance Media Buyer (Meta & Google)',
    department_id: 'd5',
    joining_date: '2024-06-01',
    salary: 13500,
    status: 'Active',
    emergency_contact: '+971 56 888 3344',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    created_at: '2024-06-01'
  },
  {
    id: 'emp-6',
    employee_code: 'DS-006',
    first_name: 'Kareem',
    last_name: 'Farooq',
    email: 'kareem@digiscore.agency',
    phone: '+971 54 222 1199',
    role_title: 'Senior Full Stack Engineer',
    department_id: 'd6',
    joining_date: '2024-07-15',
    salary: 15000,
    status: 'Active',
    emergency_contact: '+971 54 111 5566',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    created_at: '2024-07-15'
  },
  {
    id: 'emp-7',
    employee_code: 'DS-007',
    first_name: 'Fatima',
    last_name: 'Zahra',
    email: 'fatima@digiscore.agency',
    phone: '+971 50 666 4433',
    role_title: 'Senior Financial Controller',
    department_id: 'd7',
    joining_date: '2024-08-01',
    salary: 14000,
    status: 'Active',
    emergency_contact: '+971 50 555 7788',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    created_at: '2024-08-01'
  },
  {
    id: 'emp-8',
    employee_code: 'DS-008',
    first_name: 'Maya',
    last_name: 'Lin',
    email: 'maya@digiscore.agency',
    phone: '+971 52 333 4455',
    role_title: 'Senior Brand & Visual Designer',
    department_id: 'd3',
    joining_date: '2024-09-01',
    salary: 13500,
    status: 'Active',
    emergency_contact: '+971 52 999 4433',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    created_at: '2024-09-01'
  },
  {
    id: 'emp-9',
    employee_code: 'DS-009',
    first_name: 'Zainab',
    last_name: 'Rashid',
    email: 'zainab@digiscore.agency',
    phone: '+971 50 888 9900',
    role_title: 'Head of People & Operations',
    department_id: 'd8',
    joining_date: '2024-08-15',
    salary: 14000,
    status: 'Active',
    emergency_contact: '+971 50 111 2244',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    created_at: '2024-08-15'
  }
];

export const INITIAL_SERVICES: Service[] = [
  { id: 's1', name: 'Brand Strategy & Identity', code: 'BRAND-ID', category: 'Branding', description: 'Complete brand guidelines, logos, typography and voice', base_price: 4500, is_active: true, created_at: '2026-01-01' },
  { id: 's2', name: 'Social Media Management (SMM)', code: 'SMM-CORE', category: 'Social Media', description: 'Content calendar, graphic design, daily community engagement', base_price: 3500, is_active: true, created_at: '2026-01-01' },
  { id: 's3', name: 'Graphic Design & Ad Creatives', code: 'DESIGN-CREATIVE', category: 'Design', description: 'High-converting ad banners, social carousels and print collaterals', base_price: 2800, is_active: true, created_at: '2026-01-01' },
  { id: 's4', name: 'Reels & Short-Form Video', code: 'VIDEO-REELS', category: 'Video', description: 'Concept, filming, edit, sound effects, subtitles and motion graphics', base_price: 4200, is_active: true, created_at: '2026-01-01' },
  { id: 's5', name: 'Meta Ads Performance Marketing', code: 'ADS-META', category: 'Performance', description: 'ROAS-driven Facebook and Instagram lead gen and conversion campaigns', base_price: 3800, is_active: true, created_at: '2026-01-01' },
  { id: 's6', name: 'Google Ads & Search PPC', code: 'ADS-GOOGLE', category: 'Performance', description: 'Search, Display, Performance Max & YouTube advertising', base_price: 3500, is_active: true, created_at: '2026-01-01' },
  { id: 's7', name: 'Search Engine Optimization (SEO)', code: 'SEO-GROWTH', category: 'SEO', description: 'Technical SEO, keyword cluster ranking, and backlinks', base_price: 3000, is_active: true, created_at: '2026-01-01' },
  { id: 's8', name: 'High-Converting Web Development', code: 'WEB-PRO', category: 'Development', description: 'Modern responsive websites, headless CMS and speed optimization', base_price: 6500, is_active: true, created_at: '2026-01-01' }
];

export const INITIAL_PACKAGES: Package[] = [
  {
    id: 'pkg-1',
    name: 'Growth Starter',
    description: 'Essential social & brand presence for ambitious startups and local ventures',
    price: 3500,
    duration: 'Monthly',
    is_custom: false,
    poster_quantity: 8,
    reel_quantity: 4,
    video_quantity: 1,
    story_quantity: 15,
    carousel_quantity: 2,
    ad_management: false,
    seo: false,
    other_deliverables: 'Monthly Performance Analytics Report + Bio Optimization',
    created_at: '2026-01-01'
  },
  {
    id: 'pkg-2',
    name: 'Scale Acceleration',
    description: 'Our flagship full-funnel digital dominance package for scaling businesses',
    price: 6500,
    duration: 'Monthly',
    is_custom: false,
    poster_quantity: 16,
    reel_quantity: 8,
    video_quantity: 2,
    story_quantity: 30,
    carousel_quantity: 4,
    ad_management: true,
    seo: true,
    other_deliverables: 'Meta Ad Management ($2k-$10k spend) + Bi-weekly Strategy Calls',
    created_at: '2026-01-01'
  },
  {
    id: 'pkg-3',
    name: 'Enterprise Dominance',
    description: 'Omnichannel luxury brand presence, cinema-grade video, and global campaign scaling',
    price: 12000,
    duration: 'Monthly',
    is_custom: false,
    poster_quantity: 24,
    reel_quantity: 16,
    video_quantity: 4,
    story_quantity: 60,
    carousel_quantity: 8,
    ad_management: true,
    seo: true,
    other_deliverables: 'Full-funnel Meta + Google Ads + Onsite Video Shoots + Dedicated Account Director',
    created_at: '2026-01-01'
  }
];

// Clean Operational Initial Data (Empty for fresh production start)
export const INITIAL_CLIENTS: Client[] = [];
export const INITIAL_COMPANIES: Company[] = [];
export const INITIAL_LEADS: Lead[] = [];
export const INITIAL_FOLLOWUPS: Followup[] = [];
export const INITIAL_DEALS: Deal[] = [];
export const INITIAL_PROJECTS: Project[] = [];
export const INITIAL_TASKS: Task[] = [];
export const INITIAL_CONTENT: ContentItem[] = [];
export const INITIAL_QUOTATIONS: Quotation[] = [];
export const INITIAL_INVOICES: Invoice[] = [];
export const INITIAL_PAYMENTS: Payment[] = [];

export const INITIAL_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'c1', name: 'Office Rent', description: 'Prime Downtown Dubai office lease' },
  { id: 'c2', name: 'Staff Salary', description: 'Monthly payroll disbursements' },
  { id: 'c3', name: 'Software & SaaS', description: 'Figma, Adobe, Midjourney, hosting, tools' },
  { id: 'c4', name: 'Marketing & Ads', description: 'Agency self-promotional paid campaigns' },
  { id: 'c5', name: 'Internet & Utilities', description: 'Fiber internet, telecom and electricity' },
  { id: 'c6', name: 'Equipment & Hardware', description: 'Cameras, workstations, studio gears' },
  { id: 'c7', name: 'Travel & Client Hospitality', description: 'Client lunches, regional travel' }
];

export const INITIAL_EXPENSES: Expense[] = [];
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];
export const INITIAL_LEAVES: LeaveRequest[] = [];
export const INITIAL_SALARIES: SalaryRecord[] = [];
export const INITIAL_DOCUMENTS: DocumentItem[] = [];
export const INITIAL_COMMUNICATIONS: CommunicationLog[] = [];
export const INITIAL_NOTIFICATIONS: SystemNotification[] = [];
