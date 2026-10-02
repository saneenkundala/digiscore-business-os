export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'SALES'
  | 'ACCOUNTANT'
  | 'DESIGNER'
  | 'VIDEO_EDITOR'
  | 'MARKETING_EXECUTIVE'
  | 'DEVELOPER'
  | 'HR'
  | 'EMPLOYEE'
  | 'CLIENT'
  | string;

export type UserStatus = 'Active' | 'Inactive' | 'Suspended';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export';

export type ModuleKey =
  | 'dashboard'
  | 'crm'
  | 'leads'
  | 'followups'
  | 'deals'
  | 'pipeline'
  | 'clients'
  | 'companies'
  | 'sales'
  | 'quotations'
  | 'invoices'
  | 'payments'
  | 'projects'
  | 'tasks'
  | 'content'
  | 'content_approval'
  | 'finance'
  | 'expenses'
  | 'hr'
  | 'employees'
  | 'attendance'
  | 'leave'
  | 'salary'
  | 'documents'
  | 'communication'
  | 'reports'
  | 'settings'
  | 'users';

export type RolePermissions = Record<ModuleKey, Record<PermissionAction, boolean>>;

export type DashboardWidgetKey =
  | 'total_leads'
  | 'my_leads'
  | 'followups'
  | 'sales_pipeline'
  | 'active_clients'
  | 'my_projects'
  | 'my_tasks'
  | 'overdue_tasks'
  | 'content_calendar'
  | 'pending_approvals'
  | 'revenue'
  | 'pending_payments'
  | 'expenses'
  | 'attendance'
  | 'leave_balance'
  | 'salary'
  | 'notifications'
  | 'recent_activities';

export interface UserAccount {
  id: string;
  full_name: string;
  email: string;
  password?: string;
  phone?: string;
  role_key: UserRole;
  department?: string;
  designation?: string;
  avatar_url?: string;
  status: UserStatus;
  joining_date?: string;
  last_login?: string;
  created_at: string;
  is_online?: boolean;
  last_seen?: string;
  status_message?: string;
  custom_dashboard_widgets?: DashboardWidgetKey[];
  custom_permissions?: Partial<RolePermissions>;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  role_key: UserRole;
  department?: string;
  designation?: string;
  status?: UserStatus;
  is_active: boolean;
  joining_date?: string;
  last_login?: string;
  created_at: string;
}

export interface CustomRoleDefinition {
  id: string;
  key: string;
  name: string;
  description: string;
  is_system: boolean;
  base_role?: UserRole;
  created_at: string;
}

export interface UserActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  action: string;
  module: string;
  description: string;
  timestamp: string;
  ip_address?: string;
  device?: string;
}

export interface LoginActivity {
  id: string;
  user_id: string;
  user_name: string;
  email: string;
  role: string;
  login_time: string;
  last_active: string;
  device: string;
  status: 'Success' | 'Failed';
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  color: string;
  created_at: string;
}

export interface Employee {
  id: string;
  profile_id?: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role_title: string;
  department_id?: string;
  department?: Department;
  joining_date: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Probation' | 'Terminated';
  emergency_contact?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  logo_url?: string;
  created_at: string;
}

export interface Contact {
  id: string;
  company_id: string;
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  designation?: string;
  is_primary: boolean;
}

export interface Client {
  id: string;
  company_id?: string;
  company?: Company;
  client_code: string;
  name: string;
  status: 'Active' | 'On Hold' | 'Past' | 'Lead';
  website?: string;
  brand_color?: string;
  monthly_retainer: number;
  total_billed: number;
  total_paid: number;
  outstanding_amount: number;
  portal_user_id?: string;
  primary_contact_name?: string;
  primary_contact_email?: string;
  primary_contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Meeting'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Won'
  | 'Lost';

export interface Lead {
  id: string;
  lead_code: string;
  name: string;
  company: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  location?: string;
  industry?: string;
  lead_source?: string;
  interested_service?: string;
  estimated_budget: number;
  status: LeadStatus;
  assigned_salesperson_id?: string;
  assigned_salesperson?: Employee;
  last_contact_at?: string;
  next_followup_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: 'Call' | 'WhatsApp' | 'Email' | 'Meeting' | 'Note' | 'Proposal' | 'Follow-up';
  summary: string;
  details?: string;
  performed_by?: string;
  performed_by_name?: string;
  performed_at: string;
  created_at: string;
}

export interface Followup {
  id: string;
  lead_id?: string;
  lead_name?: string;
  client_id?: string;
  client_name?: string;
  title: string;
  due_date: string;
  status: 'Pending' | 'Completed' | 'Cancelled' | 'Overdue';
  notes?: string;
  assigned_to?: string;
  assigned_name?: string;
  created_at: string;
}

export type DealStage =
  | 'New Lead'
  | 'Contacted'
  | 'Qualified'
  | 'Meeting'
  | 'Proposal'
  | 'Negotiation'
  | 'Won'
  | 'Lost';

export interface Deal {
  id: string;
  deal_code: string;
  lead_id?: string;
  client_id?: string;
  company_name: string;
  title: string;
  deal_value: number;
  salesperson_id?: string;
  salesperson_name?: string;
  stage: DealStage;
  probability: number;
  expected_closing_date: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  base_price: number;
  is_active: boolean;
  created_at: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  is_custom: boolean;
  poster_quantity: number;
  reel_quantity: number;
  video_quantity: number;
  story_quantity: number;
  carousel_quantity: number;
  ad_management: boolean;
  seo: boolean;
  other_deliverables?: string;
  created_at: string;
}

export type ProjectStatus = 'Planning' | 'Active' | 'On Hold' | 'Review' | 'Completed' | 'Cancelled';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Project {
  id: string;
  project_code: string;
  name: string;
  client_id: string;
  client_name?: string;
  package_id?: string;
  package_name?: string;
  project_manager_id?: string;
  project_manager_name?: string;
  start_date: string;
  end_date?: string;
  budget: number;
  status: ProjectStatus;
  priority: PriorityLevel;
  description?: string;
  progress_percentage: number;
  team_members?: string[];
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Client Approval' | 'Completed';

export interface Task {
  id: string;
  task_code: string;
  project_id?: string;
  project_name?: string;
  client_id?: string;
  client_name?: string;
  title: string;
  description?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  priority: PriorityLevel;
  status: TaskStatus;
  start_date?: string;
  due_date: string;
  estimated_hours: number;
  actual_hours: number;
  completed_at?: string;
  comments_count?: number;
  attachments_count?: number;
  created_at: string;
  updated_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_name: string;
  comment: string;
  created_at: string;
}

export type ContentType = 'Poster' | 'Reel' | 'Video' | 'Story' | 'Carousel' | 'Ad Creative' | 'Blog';
export type ContentStatus =
  | 'Idea'
  | 'Assigned'
  | 'Designing'
  | 'Internal Review'
  | 'Client Approval'
  | 'Approved'
  | 'Scheduled'
  | 'Published'
  | 'Rejected';

export interface ContentItem {
  id: string;
  content_code: string;
  client_id: string;
  client_name?: string;
  project_id?: string;
  content_type: ContentType;
  topic: string;
  caption?: string;
  hashtags?: string;
  assigned_designer_id?: string;
  assigned_designer_name?: string;
  assigned_video_editor_id?: string;
  assigned_video_editor_name?: string;
  deadline: string;
  scheduled_date?: string;
  published_date?: string;
  status: ContentStatus;
  file_url?: string;
  thumbnail_url?: string;
  client_feedback?: string;
  revision_count: number;
  created_at: string;
  updated_at: string;
}

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired';

export interface Quotation {
  id: string;
  quotation_number: string;
  client_id?: string;
  client_name: string;
  date: string;
  expiry_date: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  terms?: string;
  notes?: string;
  status: QuotationStatus;
  created_at: string;
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name: string;
  project_id?: string;
  project_name?: string;
  invoice_date: string;
  due_date: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paid_amount: number;
  balance: number;
  status: InvoiceStatus;
  notes?: string;
  terms?: string;
  created_at: string;
  updated_at: string;
}

export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'UPI' | 'Card' | 'Online Payment';

export interface Payment {
  id: string;
  payment_number: string;
  client_id: string;
  client_name: string;
  invoice_id?: string;
  invoice_number?: string;
  amount: number;
  payment_method: PaymentMethod;
  transaction_reference?: string;
  payment_date: string;
  notes?: string;
  created_at: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Expense {
  id: string;
  expense_number: string;
  category_id: string;
  category_name: string;
  amount: number;
  date: string;
  vendor: string;
  payment_method: string;
  description: string;
  attachment_url?: string;
  added_by?: string;
  created_at: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'Leave' | 'Holiday';

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  date: string;
  punch_in?: string;
  punch_out?: string;
  status: AttendanceStatus;
  total_hours: number;
  notes?: string;
  work_mode?: 'Office' | 'Remote';
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  leave_type: 'Annual' | 'Sick' | 'Casual' | 'Maternity' | 'Unpaid';
  start_date: string;
  end_date: string;
  days_count: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approved_by_name?: string;
  created_at: string;
}

export interface SalaryRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  month: number;
  year: number;
  basic_salary: number;
  allowances: number;
  bonuses: number;
  unpaid_leave_deduction: number;
  other_deductions: number;
  net_salary: number;
  payment_status: 'Pending' | 'Paid';
  payment_date?: string;
  transaction_reference?: string;
}

export type DocumentCategory =
  | 'Client Documents'
  | 'Contracts'
  | 'Agreements'
  | 'Quotations'
  | 'Invoices'
  | 'Employee Documents'
  | 'Company Documents'
  | 'Project Files';

export interface DocumentItem {
  id: string;
  title: string;
  category: DocumentCategory;
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string;
  client_id?: string;
  client_name?: string;
  project_id?: string;
  project_name?: string;
  employee_id?: string;
  employee_name?: string;
  created_at: string;
}

export interface CommunicationLog {
  id: string;
  channel: 'WhatsApp' | 'Phone Calls' | 'Email' | 'Meetings' | 'Notes';
  subject: string;
  details: string;
  lead_name?: string;
  client_name?: string;
  logged_by: string;
  communicated_at: string;
}

export interface SystemNotification {
  id: string;
  user_id?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link_url?: string;
  is_read: boolean;
  created_at: string;
}

export type ChatMessageType = 'text' | 'voice' | 'image' | 'video' | 'file';

export interface ChatReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  sender_role?: string;
  recipient_id: string; // user ID for 1-on-1 DM, or channel ID like 'chan-general'
  recipient_name?: string;
  type: ChatMessageType;
  text?: string;
  media_url?: string;
  media_name?: string;
  media_size?: string;
  media_duration?: number; // duration in seconds
  created_at: string;
  status: 'sent' | 'delivered' | 'read';
  reactions?: ChatReaction[];
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  is_channel: true;
  avatar_url?: string;
  members_count: number;
  unread_count?: number;
  last_message?: string;
  last_message_at?: string;
  member_ids?: string[];
}

export interface StaffChatContact {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department: string;
  avatar_url: string;
  is_online: boolean;
  last_seen: string;
  status_message?: string;
  unread_count?: number;
  last_message?: string;
  last_message_at?: string;
}
