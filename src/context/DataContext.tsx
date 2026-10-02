import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Department,
  Employee,
  Company,
  Client,
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
  SystemNotification,
  ChatMessage,
  ChatChannel,
  StaffChatContact
} from '../types';
import {
  INITIAL_CHAT_CHANNELS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_STAFF_CONTACTS
} from '../data/chatData';
import { playMessageChime } from '../lib/sound';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_EMPLOYEES,
  INITIAL_COMPANIES,
  INITIAL_SERVICES,
  INITIAL_PACKAGES,
  INITIAL_CLIENTS,
  INITIAL_LEADS,
  INITIAL_FOLLOWUPS,
  INITIAL_DEALS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_CONTENT,
  INITIAL_INVOICES,
  INITIAL_QUOTATIONS,
  INITIAL_PAYMENTS,
  INITIAL_EXPENSE_CATEGORIES,
  INITIAL_EXPENSES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_SALARIES,
  INITIAL_DOCUMENTS,
  INITIAL_COMMUNICATIONS,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface DataContextType {
  departments: Department[];
  employees: Employee[];
  companies: Company[];
  services: Service[];
  packages: Package[];
  clients: Client[];
  leads: Lead[];
  followups: Followup[];
  deals: Deal[];
  projects: Project[];
  tasks: Task[];
  contentItems: ContentItem[];
  invoices: Invoice[];
  quotations: Quotation[];
  payments: Payment[];
  expenses: Expense[];
  expenseCategories: ExpenseCategory[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  salaries: SalaryRecord[];
  documents: DocumentItem[];
  communications: CommunicationLog[];
  notifications: SystemNotification[];

  // Leads & CRM
  addLead: (lead: Omit<Lead, 'id' | 'lead_code' | 'created_at' | 'updated_at'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  convertLeadToClient: (leadId: string) => { client: Client; project?: Project };

  // Follow-ups
  addFollowup: (fol: Omit<Followup, 'id' | 'created_at'>) => void;
  completeFollowup: (id: string) => void;
  deleteFollowup: (id: string) => void;

  // Companies
  addCompany: (comp: Omit<Company, 'id' | 'created_at'>) => void;
  deleteCompany: (id: string) => void;

  // Deals
  addDeal: (deal: Omit<Deal, 'id' | 'deal_code' | 'created_at' | 'updated_at'>) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  updateDealStage: (id: string, newStage: Deal['stage']) => void;
  deleteDeal: (id: string) => void;

  // Clients
  addClient: (client: Omit<Client, 'id' | 'client_code' | 'created_at' | 'updated_at'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // Projects
  addProject: (project: Omit<Project, 'id' | 'project_code' | 'created_at' | 'updated_at'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Tasks
  addTask: (task: Omit<Task, 'id' | 'task_code' | 'created_at' | 'updated_at'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (id: string, newStatus: Task['status']) => void;
  deleteTask: (id: string) => void;

  // Content
  addContentItem: (item: Omit<ContentItem, 'id' | 'content_code' | 'created_at' | 'updated_at' | 'revision_count'>) => void;
  updateContentItem: (id: string, updates: Partial<ContentItem>) => void;
  approveContent: (id: string, feedback?: string) => void;
  requestContentChanges: (id: string, feedback: string) => void;
  deleteContentItem: (id: string) => void;

  // Finance
  addQuotation: (q: Omit<Quotation, 'id' | 'quotation_number' | 'created_at'>) => void;
  updateQuotation: (id: string, updates: Partial<Quotation>) => void;
  addInvoice: (inv: Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'updated_at'>) => void;
  recordPayment: (payment: Omit<Payment, 'id' | 'payment_number' | 'created_at'>) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'expense_number' | 'created_at'>) => void;
  deleteExpense: (id: string) => void;

  // HR & Staff Attendance
  addEmployee: (employee: Omit<Employee, 'id' | 'employee_code' | 'created_at'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  punchAttendance: (employeeId: string, status: AttendanceRecord['status']) => void;
  punchIn: (userOrEmpId: string, userName: string, workMode?: 'Office' | 'Remote', notes?: string) => void;
  punchOut: (userOrEmpId: string, userName?: string) => void;
  getStaffTodayAttendance: (userOrEmpId?: string, userName?: string) => AttendanceRecord | undefined;
  submitLeaveRequest: (leave: Omit<LeaveRequest, 'id' | 'status' | 'created_at'>) => void;
  reviewLeaveRequest: (id: string, status: 'Approved' | 'Rejected', reviewerName: string) => void;
  markSalaryPaid: (id: string, reference?: string) => void;

  // Documents & Communications
  addDocument: (doc: Omit<DocumentItem, 'id' | 'created_at'>) => void;
  deleteDocument: (id: string) => void;
  logCommunication: (com: Omit<CommunicationLog, 'id' | 'communicated_at'>) => void;

  // Internal Team Chat & Messenger
  chatMessages: ChatMessage[];
  chatChannels: ChatChannel[];
  chatContacts: StaffChatContact[];
  totalUnreadChatCount: number;
  sendChatMessage: (msg: Omit<ChatMessage, 'id' | 'created_at' | 'status'>) => void;
  toggleChatReaction: (messageId: string, emoji: string, userName: string) => void;
  markChatAsRead: (targetId: string, currentUserId: string) => void;
  updateUserPresence: (userId: string, isOnline: boolean, statusMessage?: string) => void;
  simulateIncomingMessage: (fromStaffId?: string, text?: string, recipientUserId?: string) => void;
  addChannelMember: (channelId: string, staffId: string) => void;
  removeChannelMember: (channelId: string, staffId: string) => void;
  createChannel: (name: string, description: string, memberIds: string[]) => string;
  updateStaffPhoto: (staffIdOrEmail: string, newPhotoUrl: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  pushNotification: (title: string, message: string, type?: SystemNotification['type']) => void;

  // Reset & Clear
  resetToInitialData: () => void;
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_PREFIX = 'digiscore_os_v3_clean_';

// Auto-purge any stale legacy demo data from localStorage
if (typeof window !== 'undefined') {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('digiscore_business_os_') || k.startsWith('digiscore_v1_') || k.startsWith('digiscore_v2_'))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (e) {
    // Ignore storage access errors
  }
}

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [departments] = useState<Department[]>(() => getStored('departments', INITIAL_DEPARTMENTS));
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const raw = getStored<Employee[]>('employees', INITIAL_EMPLOYEES);
    const list = raw.length < INITIAL_EMPLOYEES.length ? INITIAL_EMPLOYEES : raw;
    return list.map(e => {
      if (e.id === 'emp-1' && (!e.avatar_url || e.avatar_url.includes('photo-1534528741775-53994a69daeb'))) {
        return { ...e, avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250' };
      }
      return e;
    });
  });
  const [companies, setCompanies] = useState<Company[]>(() => getStored('companies', INITIAL_COMPANIES));
  const [services] = useState<Service[]>(() => getStored('services', INITIAL_SERVICES));
  const [packages] = useState<Package[]>(() => getStored('packages', INITIAL_PACKAGES));
  const [clients, setClients] = useState<Client[]>(() => getStored('clients', INITIAL_CLIENTS));
  const [leads, setLeads] = useState<Lead[]>(() => getStored('leads', INITIAL_LEADS));
  const [followups, setFollowups] = useState<Followup[]>(() => getStored('followups', INITIAL_FOLLOWUPS));
  const [deals, setDeals] = useState<Deal[]>(() => getStored('deals', INITIAL_DEALS));
  const [projects, setProjects] = useState<Project[]>(() => getStored('projects', INITIAL_PROJECTS));
  const [tasks, setTasks] = useState<Task[]>(() => getStored('tasks', INITIAL_TASKS));
  const [contentItems, setContentItems] = useState<ContentItem[]>(() => getStored('content', INITIAL_CONTENT));
  const [invoices, setInvoices] = useState<Invoice[]>(() => getStored('invoices', INITIAL_INVOICES));
  const [quotations, setQuotations] = useState<Quotation[]>(() => getStored('quotations', INITIAL_QUOTATIONS));
  const [payments, setPayments] = useState<Payment[]>(() => getStored('payments', INITIAL_PAYMENTS));
  const [expenses, setExpenses] = useState<Expense[]>(() => getStored('expenses', INITIAL_EXPENSES));
  const [expenseCategories] = useState<ExpenseCategory[]>(() => getStored('expenseCategories', INITIAL_EXPENSE_CATEGORIES));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => getStored('attendance', INITIAL_ATTENDANCE));
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => getStored('leaves', INITIAL_LEAVES));
  const [salaries, setSalaries] = useState<SalaryRecord[]>(() => getStored('salaries', INITIAL_SALARIES));
  const [documents, setDocuments] = useState<DocumentItem[]>(() => getStored('documents', INITIAL_DOCUMENTS));
  const [communications, setCommunications] = useState<CommunicationLog[]>(() => getStored('communications', INITIAL_COMMUNICATIONS));
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => getStored('notifications', INITIAL_NOTIFICATIONS));
  const [chatChannels, setChatChannels] = useState<ChatChannel[]>(() => {
    const raw = getStored<ChatChannel[]>('chat_channels', INITIAL_CHAT_CHANNELS);
    const defaultMembers: Record<string, string[]> = {
      'chan-general': ['usr-1', 'usr-2', 'usr-3', 'usr-4', 'usr-5', 'usr-6', 'usr-7', 'usr-8', 'usr-9', 'usr-10', 'usr-11'],
      'chan-design': ['usr-1', 'usr-2', 'usr-4', 'usr-5', 'usr-9', 'usr-11'],
      'chan-video': ['usr-1', 'usr-2', 'usr-4', 'usr-5', 'usr-6'],
      'chan-sales': ['usr-1', 'usr-2', 'usr-3', 'usr-6']
    };
    return raw.map(ch => {
      const memberIds = ch.member_ids && ch.member_ids.length > 0 
        ? ch.member_ids 
        : (defaultMembers[ch.id] || ['usr-1', 'usr-2']);
      return {
        ...ch,
        member_ids: memberIds,
        members_count: memberIds.length
      };
    });
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const raw = getStored<ChatMessage[]>('chat_messages', INITIAL_CHAT_MESSAGES);
    return raw.map(m => {
      let updated = { ...m };
      if (m.sender_name === 'Bilal Ahmed' || (m.sender_id === 'usr-1' && m.sender_name !== 'Hamid Saneen')) {
        updated.sender_name = 'Hamid Saneen';
      }
      if (m.sender_id === 'usr-1' && (!m.sender_avatar || m.sender_avatar.includes('photo-1534528741775-53994a69daeb'))) {
        updated.sender_avatar = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250';
      }
      if (m.recipient_name === 'Bilal Ahmed' || (m.recipient_id === 'usr-1' && m.recipient_name !== 'Hamid Saneen')) {
        updated.recipient_name = 'Hamid Saneen';
      }
      if (m.text && m.text.includes('Bilal')) {
        updated.text = m.text.replace(/Bilal/g, 'Hamid');
      }
      if (m.reactions) {
        updated.reactions = m.reactions.map(r => ({
          ...r,
          users: r.users.map(u => {
            if (u === 'Bilal Ahmed') return 'Hamid Saneen';
            if (u === 'Priya Sharma') return 'Zainab Rashid';
            if (u === 'Arun Kumar') return 'Kareem Farooq';
            return u;
          })
        }));
      }
      return updated;
    });
  });
  const [chatContacts, setChatContacts] = useState<StaffChatContact[]>(() => {
    const raw = getStored<StaffChatContact[]>('chat_contacts', INITIAL_STAFF_CONTACTS);
    return raw.map(c => {
      if (c.id === 'usr-1' || c.full_name === 'Bilal Ahmed') {
        return {
          ...c,
          full_name: 'Hamid Saneen',
          role: 'Super Admin',
          department: 'Executive & Management',
          avatar_url: c.avatar_url && !c.avatar_url.includes('photo-1534528741775-53994a69daeb')
            ? c.avatar_url
            : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250'
        };
      }
      if (c.id === 'usr-8' || c.full_name === 'Priya Sharma') {
        return {
          ...c,
          full_name: 'Zainab Rashid',
          role: 'HR Lead',
          department: 'People & HR'
        };
      }
      if (c.id === 'usr-9' || c.full_name === 'Arun Kumar') {
        return {
          ...c,
          full_name: 'Kareem Farooq',
          role: 'Senior Developer',
          department: 'Technology & Dev'
        };
      }
      return c;
    });
  });

  // Sync state to storage
  useEffect(() => { setStored('employees', employees); }, [employees]);
  useEffect(() => { setStored('companies', companies); }, [companies]);
  useEffect(() => { setStored('clients', clients); }, [clients]);
  useEffect(() => { setStored('leads', leads); }, [leads]);
  useEffect(() => { setStored('followups', followups); }, [followups]);
  useEffect(() => { setStored('deals', deals); }, [deals]);
  useEffect(() => { setStored('projects', projects); }, [projects]);
  useEffect(() => { setStored('tasks', tasks); }, [tasks]);
  useEffect(() => { setStored('content', contentItems); }, [contentItems]);
  useEffect(() => { setStored('invoices', invoices); }, [invoices]);
  useEffect(() => { setStored('quotations', quotations); }, [quotations]);
  useEffect(() => { setStored('payments', payments); }, [payments]);
  useEffect(() => { setStored('expenses', expenses); }, [expenses]);
  useEffect(() => { setStored('attendance', attendance); }, [attendance]);
  useEffect(() => { setStored('leaves', leaves); }, [leaves]);
  useEffect(() => { setStored('salaries', salaries); }, [salaries]);
  useEffect(() => { setStored('documents', documents); }, [documents]);
  useEffect(() => { setStored('communications', communications); }, [communications]);
  useEffect(() => { setStored('notifications', notifications); }, [notifications]);
  useEffect(() => { setStored('chat_channels', chatChannels); }, [chatChannels]);
  useEffect(() => { setStored('chat_messages', chatMessages); }, [chatMessages]);
  useEffect(() => { setStored('chat_contacts', chatContacts); }, [chatContacts]);

  // Push notification helper
  const pushNotification = (title: string, message: string, type: SystemNotification['type'] = 'info') => {
    const newNotif: SystemNotification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      is_read: false,
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Leads
  const addLead = (leadData: Omit<Lead, 'id' | 'lead_code' | 'created_at' | 'updated_at'>) => {
    const newLead: Lead = {
      ...leadData,
      id: 'lead-' + Date.now(),
      lead_code: `LD-${Math.floor(100 + Math.random() * 900)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setLeads(prev => [newLead, ...prev]);
    pushNotification('New Lead Added', `${newLead.name} from ${newLead.company} has been added.`, 'info');
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates, updated_at: new Date().toISOString() } : l));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const convertLeadToClient = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    const newClient: Client = {
      id: 'cli-' + Date.now(),
      client_code: `CLI-${lead.company.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase() || 'NEW'}`,
      name: lead.company,
      status: 'Active',
      monthly_retainer: lead.estimated_budget || 5000,
      total_billed: lead.estimated_budget || 5000,
      total_paid: 0,
      outstanding_amount: lead.estimated_budget || 5000,
      brand_color: '#8B5CF6',
      primary_contact_name: lead.name,
      primary_contact_email: lead.email,
      primary_contact_phone: lead.phone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const newProject: Project = {
      id: 'proj-' + Date.now(),
      project_code: `PRJ-${newClient.client_code}-01`,
      name: `${lead.company} — Brand Kickoff & Onboarding`,
      client_id: newClient.id,
      client_name: newClient.name,
      package_name: 'Scale Acceleration',
      project_manager_name: 'Sarah Al-Hashemi',
      start_date: new Date().toISOString().slice(0, 10),
      budget: lead.estimated_budget || 5000,
      status: 'Active',
      priority: 'High',
      description: 'Initial onboarding sprint converted from won lead.',
      progress_percentage: 10,
      team_members: ['Sarah Al-Hashemi', 'Rayyan Khan'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Mark lead as Won
    updateLead(leadId, { status: 'Won' });
    setClients(prev => [newClient, ...prev]);
    setProjects(prev => [newProject, ...prev]);

    pushNotification('Lead Converted! 🚀', `${lead.company} is now an Active Client with Project #${newProject.project_code}!`, 'success');
    return { client: newClient, project: newProject };
  };

  // Follow-ups
  const addFollowup = (folData: Omit<Followup, 'id' | 'created_at'>) => {
    const newFol: Followup = {
      ...folData,
      id: 'fol-' + Date.now(),
      created_at: new Date().toISOString()
    };
    setFollowups(prev => [newFol, ...prev]);
    pushNotification('Follow-up Scheduled', `Follow-up "${newFol.title}" logged.`, 'info');
  };

  const completeFollowup = (id: string) => {
    setFollowups(prev => prev.map(f => f.id === id ? { ...f, status: 'Completed' } : f));
    pushNotification('Follow-up Completed', 'Follow-up marked as completed.', 'success');
  };

  const deleteFollowup = (id: string) => {
    setFollowups(prev => prev.filter(f => f.id !== id));
  };

  // Companies
  const addCompany = (compData: Omit<Company, 'id' | 'created_at'>) => {
    const newComp: Company = {
      ...compData,
      id: 'comp-' + Date.now(),
      created_at: new Date().toISOString()
    };
    setCompanies(prev => [newComp, ...prev]);
    pushNotification('Company Added', `Company "${newComp.name}" registered.`, 'info');
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
  };

  // Deals
  const addDeal = (dealData: Omit<Deal, 'id' | 'deal_code' | 'created_at' | 'updated_at'>) => {
    const newDeal: Deal = {
      ...dealData,
      id: 'deal-' + Date.now(),
      deal_code: `DL-${Math.floor(200 + Math.random() * 800)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setDeals(prev => [newDeal, ...prev]);
  };

  const updateDeal = (id: string, updates: Partial<Deal>) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, ...updates, updated_at: new Date().toISOString() } : d));
  };

  const updateDealStage = (id: string, newStage: Deal['stage']) => {
    const probMap: Record<Deal['stage'], number> = {
      'New Lead': 20,
      'Contacted': 30,
      'Qualified': 40,
      'Meeting': 50,
      'Proposal': 65,
      'Negotiation': 80,
      'Won': 100,
      'Lost': 0
    };
    setDeals(prev => prev.map(d => {
      if (d.id === id) {
        if (newStage === 'Won') {
          pushNotification('Deal Won! 🎉', `Deal "${d.title}" valued at ₹${d.deal_value.toLocaleString('en-IN')} was marked WON!`, 'success');
        }
        return {
          ...d,
          stage: newStage,
          probability: probMap[newStage] ?? d.probability,
          updated_at: new Date().toISOString()
        };
      }
      return d;
    }));
  };

  const deleteDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
  };

  // Clients
  const addClient = (clientData: Omit<Client, 'id' | 'client_code' | 'created_at' | 'updated_at'>) => {
    const newClient: Client = {
      ...clientData,
      id: 'cli-' + Date.now(),
      client_code: `CLI-${Math.floor(100 + Math.random() * 900)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setClients(prev => [newClient, ...prev]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  // Projects
  const addProject = (pData: Omit<Project, 'id' | 'project_code' | 'created_at' | 'updated_at'>) => {
    const newProj: Project = {
      ...pData,
      id: 'proj-' + Date.now(),
      project_code: `PRJ-${Math.floor(100 + Math.random() * 900)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setProjects(prev => [newProj, ...prev]);
    pushNotification('New Project Initiated', `Project ${newProj.name} is now active.`, 'info');
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Tasks
  const addTask = (tData: Omit<Task, 'id' | 'task_code' | 'created_at' | 'updated_at'>) => {
    const newTask: Task = {
      ...tData,
      id: 'tsk-' + Date.now(),
      task_code: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    pushNotification('Task Assigned', `Task "${newTask.title}" assigned to ${newTask.assigned_to_name || 'unassigned'}.`, 'info');
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t));
  };

  const updateTaskStatus = (id: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const completed_at = newStatus === 'Completed' ? new Date().toISOString() : undefined;
        return { ...t, status: newStatus, completed_at, updated_at: new Date().toISOString() };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Content
  const addContentItem = (itemData: Omit<ContentItem, 'id' | 'content_code' | 'created_at' | 'updated_at' | 'revision_count'>) => {
    const newItem: ContentItem = {
      ...itemData,
      id: 'cnt-' + Date.now(),
      content_code: `CNT-${Math.floor(10 + Math.random() * 90)}`,
      revision_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setContentItems(prev => [newItem, ...prev]);
    pushNotification('New Content Item', `New ${newItem.content_type} created: "${newItem.topic}"`, 'info');
  };

  const updateContentItem = (id: string, updates: Partial<ContentItem>) => {
    setContentItems(prev => prev.map(c => c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c));
  };

  const approveContent = (id: string, feedback?: string) => {
    setContentItems(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'Approved',
          client_feedback: feedback || 'Approved by client.',
          updated_at: new Date().toISOString()
        };
      }
      return c;
    }));
    pushNotification('Content Approved! ✅', 'Client has approved the deliverable.', 'success');
  };

  const requestContentChanges = (id: string, feedback: string) => {
    setContentItems(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'Designing',
          client_feedback: feedback,
          revision_count: c.revision_count + 1,
          updated_at: new Date().toISOString()
        };
      }
      return c;
    }));
    pushNotification('Changes Requested ✍️', `Client requested revisions: "${feedback}"`, 'warning');
  };

  const deleteContentItem = (id: string) => {
    setContentItems(prev => prev.filter(c => c.id !== id));
  };

  // Finance: Quotations, Invoices, Payments, Expenses
  const addQuotation = (qData: Omit<Quotation, 'id' | 'quotation_number' | 'created_at'>) => {
    const newQ: Quotation = {
      ...qData,
      id: 'q-' + Date.now(),
      quotation_number: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      created_at: new Date().toISOString()
    };
    setQuotations(prev => [newQ, ...prev]);
  };

  const updateQuotation = (id: string, updates: Partial<Quotation>) => {
    setQuotations(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const addInvoice = (invData: Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'updated_at'>) => {
    const newInv: Invoice = {
      ...invData,
      id: 'inv-' + Date.now(),
      invoice_number: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setInvoices(prev => [newInv, ...prev]);

    // Update client total_billed and outstanding
    setClients(prev => prev.map(c => {
      if (c.id === newInv.client_id) {
        return {
          ...c,
          total_billed: c.total_billed + newInv.total,
          outstanding_amount: c.outstanding_amount + newInv.balance
        };
      }
      return c;
    }));

    pushNotification('Invoice Generated', `Invoice ${newInv.invoice_number} sent to ${newInv.client_name}.`, 'info');
  };

  const recordPayment = (pData: Omit<Payment, 'id' | 'payment_number' | 'created_at'>) => {
    const newPay: Payment = {
      ...pData,
      id: 'pay-' + Date.now(),
      payment_number: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString()
    };
    setPayments(prev => [newPay, ...prev]);

    // Adjust invoice balance if attached
    if (newPay.invoice_id) {
      setInvoices(prev => prev.map(inv => {
        if (inv.id === newPay.invoice_id) {
          const newPaid = inv.paid_amount + newPay.amount;
          const newBalance = Math.max(0, inv.total - newPaid);
          const newStatus = newBalance === 0 ? 'Paid' : 'Partially Paid';
          return { ...inv, paid_amount: newPaid, balance: newBalance, status: newStatus, updated_at: new Date().toISOString() };
        }
        return inv;
      }));
    }

    // Adjust client outstanding
    setClients(prev => prev.map(c => {
      if (c.id === newPay.client_id) {
        return {
          ...c,
          total_paid: c.total_paid + newPay.amount,
          outstanding_amount: Math.max(0, c.outstanding_amount - newPay.amount)
        };
      }
      return c;
    }));

    pushNotification('Payment Recorded! 💰', `Received ₹${newPay.amount.toLocaleString('en-IN')} from ${newPay.client_name}.`, 'success');
  };

  const addExpense = (expData: Omit<Expense, 'id' | 'expense_number' | 'created_at'>) => {
    const newExp: Expense = {
      ...expData,
      id: 'exp-' + Date.now(),
      expense_number: `EXP-2026-${Math.floor(10 + Math.random() * 90)}`,
      created_at: new Date().toISOString()
    };
    setExpenses(prev => [newExp, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // HR
  const addEmployee = (empData: Omit<Employee, 'id' | 'employee_code' | 'created_at'>) => {
    const newEmp: Employee = {
      ...empData,
      id: 'emp-' + Date.now(),
      employee_code: `DS-${Math.floor(100 + Math.random() * 900)}`,
      created_at: new Date().toISOString()
    };
    setEmployees(prev => [newEmp, ...prev]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const getTodayDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getStaffTodayAttendance = (userOrEmpId?: string, userName?: string): AttendanceRecord | undefined => {
    const today = getTodayDateStr();
    return attendance.find(a => {
      const matchDate = a.date === today;
      if (!matchDate) return false;
      if (userOrEmpId && (a.employee_id === userOrEmpId || a.id.includes(userOrEmpId))) return true;
      if (userName && a.employee_name.toLowerCase().trim() === userName.toLowerCase().trim()) return true;
      return false;
    });
  };

  const punchIn = (userOrEmpId: string, userName: string, workMode: 'Office' | 'Remote' = 'Office', notes?: string) => {
    const today = getTodayDateStr();
    const existing = getStaffTodayAttendance(userOrEmpId, userName);
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    if (existing) {
      if (!existing.punch_in) {
        setAttendance(prev => prev.map(a => a.id === existing.id ? { ...a, punch_in: nowTime, work_mode: workMode, status: 'Present' } : a));
        pushNotification('Attendance Punch In', `${userName || 'Staff'} punched in at ${nowTime} (${workMode}).`, 'success');
      } else {
        pushNotification('Already Punched In', `You already punched in today at ${existing.punch_in}.`, 'info');
      }
      return;
    }

    const emp = employees.find(e => e.id === userOrEmpId || `${e.first_name} ${e.last_name}`.toLowerCase() === userName.toLowerCase());
    const newAtt: AttendanceRecord = {
      id: 'att-' + Date.now(),
      employee_id: emp ? emp.id : userOrEmpId,
      employee_name: userName || (emp ? `${emp.first_name} ${emp.last_name}` : 'Staff Member'),
      date: today,
      punch_in: nowTime,
      status: 'Present',
      work_mode: workMode,
      total_hours: 0,
      notes: notes || `Punched in via OS (${workMode})`
    };

    setAttendance(prev => [newAtt, ...prev]);
    pushNotification('Attendance Marked Present', `Punched in successfully at ${nowTime} (${workMode}). Have a productive shift!`, 'success');
  };

  const punchOut = (userOrEmpId: string, userName?: string) => {
    const today = getTodayDateStr();
    const existing = getStaffTodayAttendance(userOrEmpId, userName);
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    if (!existing) {
      const emp = employees.find(e => e.id === userOrEmpId || (userName && `${e.first_name} ${e.last_name}`.toLowerCase() === userName.toLowerCase()));
      const newAtt: AttendanceRecord = {
        id: 'att-' + Date.now(),
        employee_id: emp ? emp.id : userOrEmpId,
        employee_name: userName || (emp ? `${emp.first_name} ${emp.last_name}` : 'Staff Member'),
        date: today,
        punch_in: '09:00 AM',
        punch_out: nowTime,
        status: 'Present',
        work_mode: 'Office',
        total_hours: 8,
        notes: 'Punched out directly'
      };
      setAttendance(prev => [newAtt, ...prev]);
      pushNotification('Punched Out', `Punch out recorded at ${nowTime}. Total 8.0 hrs logged.`, 'info');
      return;
    }

    let hoursWorked = 8;
    if (existing.punch_in) {
      try {
        const parseTime = (timeStr: string) => {
          const parts = timeStr.trim().split(/[:\s]/);
          let h = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10);
          const ampm = (parts[2] || '').toUpperCase();
          if (ampm === 'PM' && h < 12) h += 12;
          if (ampm === 'AM' && h === 12) h = 0;
          return h * 60 + m;
        };
        const inMins = parseTime(existing.punch_in);
        const now = new Date();
        const nowMins = now.getHours() * 60 + now.getMinutes();
        const diff = Math.max(15, nowMins - inMins);
        hoursWorked = parseFloat((diff / 60).toFixed(1));
      } catch {
        hoursWorked = 8;
      }
    }

    setAttendance(prev => prev.map(a => a.id === existing.id ? {
      ...a,
      punch_out: nowTime,
      total_hours: hoursWorked,
      status: hoursWorked >= 4 ? 'Present' : 'Half Day'
    } : a));

    pushNotification('Punched Out', `Great work today! Punched out at ${nowTime} (Total ${hoursWorked} hrs logged).`, 'info');
  };

  const punchAttendance = (employeeId: string, status: AttendanceRecord['status']) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;
    const today = getTodayDateStr();
    const existing = attendance.find(a => a.employee_id === employeeId && a.date === today);

    if (existing) {
      setAttendance(prev => prev.map(a => a.id === existing.id ? { ...a, status, punch_out: new Date().toTimeString().slice(0, 5) } : a));
    } else {
      const newAtt: AttendanceRecord = {
        id: 'att-' + Date.now(),
        employee_id: employeeId,
        employee_name: `${emp.first_name} ${emp.last_name}`,
        date: today,
        punch_in: new Date().toTimeString().slice(0, 5),
        status,
        total_hours: 8
      };
      setAttendance(prev => [newAtt, ...prev]);
    }
    pushNotification('Attendance Logged', `${emp.first_name} marked as ${status}.`, 'info');
  };

  const submitLeaveRequest = (lData: Omit<LeaveRequest, 'id' | 'status' | 'created_at'>) => {
    const newLeave: LeaveRequest = {
      ...lData,
      id: 'l-' + Date.now(),
      status: 'Pending',
      created_at: new Date().toISOString()
    };
    setLeaves(prev => [newLeave, ...prev]);
    pushNotification('Leave Request Submitted', `${newLeave.employee_name} submitted a ${newLeave.leave_type} leave request.`, 'info');
  };

  const reviewLeaveRequest = (id: string, status: 'Approved' | 'Rejected', reviewerName: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status, approved_by_name: reviewerName } : l));
    pushNotification('Leave Request ' + status, `Leave request has been ${status.toLowerCase()} by ${reviewerName}.`, status === 'Approved' ? 'success' : 'warning');
  };

  const markSalaryPaid = (id: string, reference?: string) => {
    setSalaries(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          payment_status: 'Paid',
          payment_date: new Date().toISOString().slice(0, 10),
          transaction_reference: reference || 'NEFT-INR-' + Math.floor(10000 + Math.random() * 90000)
        };
      }
      return s;
    }));
    pushNotification('Salary Disbursed', `Salary payment marked as Paid.`, 'success');
  };

  // Documents
  const addDocument = (docData: Omit<DocumentItem, 'id' | 'created_at'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: 'doc-' + Date.now(),
      created_at: new Date().toISOString()
    };
    setDocuments(prev => [newDoc, ...prev]);
    pushNotification('Document Uploaded', `File "${newDoc.file_name}" uploaded to ${newDoc.category}.`, 'info');
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // Communications
  const logCommunication = (cData: Omit<CommunicationLog, 'id' | 'communicated_at'>) => {
    const newLog: CommunicationLog = {
      ...cData,
      id: 'com-' + Date.now(),
      communicated_at: new Date().toISOString()
    };
    setCommunications(prev => [newLog, ...prev]);
  };

  // Internal Team Chat & Messenger
  const totalUnreadChatCount =
    chatContacts.reduce((acc, c) => acc + (c.unread_count || 0), 0) +
    chatChannels.reduce((acc, ch) => acc + (ch.unread_count || 0), 0);

  const sendChatMessage = (msgData: Omit<ChatMessage, 'id' | 'created_at' | 'status'>) => {
    const newMsg: ChatMessage = {
      ...msgData,
      id: 'msg-' + Date.now(),
      created_at: new Date().toISOString(),
      status: 'sent'
    };
    setChatMessages(prev => [...prev, newMsg]);

    const previewText = msgData.type === 'voice' 
      ? '🎙️ Voice note' 
      : msgData.type === 'image' 
        ? '📷 Image' 
        : msgData.type === 'video' 
          ? '🎬 Video' 
          : (msgData.text || 'New message');

    if (msgData.recipient_id.startsWith('chan-')) {
      setChatChannels(prev => prev.map(ch => ch.id === msgData.recipient_id ? {
        ...ch,
        last_message: `${msgData.sender_name}: ${previewText}`,
        last_message_at: newMsg.created_at
      } : ch));
    } else {
      setChatContacts(prev => prev.map(c => (c.id === msgData.recipient_id || c.id === msgData.sender_id) ? {
        ...c,
        last_message: previewText,
        last_message_at: newMsg.created_at
      } : c));
    }
  };

  const simulateIncomingMessage = (fromStaffId?: string, text?: string, recipientUserId?: string) => {
    const contact = chatContacts.find(c => c.id === fromStaffId) || chatContacts[3]; // Maya Lin by default
    const replyText = text || `Hey team! Just finalized the typography & brand guidelines for DIGI SCORE 🎨✨`;
    const targetRecipientId = recipientUserId || 'usr-1';
    const recipientContact = chatContacts.find(c => c.id === targetRecipientId);
    const targetRecipientName = recipientContact?.full_name || 'Hamid Saneen';

    const incomingMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender_id: contact.id,
      sender_name: contact.full_name,
      sender_avatar: contact.avatar_url,
      sender_role: contact.role,
      recipient_id: targetRecipientId,
      recipient_name: targetRecipientName,
      type: 'text',
      text: replyText,
      created_at: new Date().toISOString(),
      status: 'delivered'
    };

    // When staff replies or sends a message, they also read previous messages sent to them
    setChatMessages(prev => [
      ...prev.map(m => (m.recipient_id === contact.id && m.status !== 'read') ? { ...m, status: 'read' as const } : m),
      incomingMsg
    ]);
    playMessageChime();
    pushNotification(`New Message from ${contact.full_name}`, replyText, 'info');

    setChatContacts(prev => prev.map(c => c.id === contact.id ? {
      ...c,
      unread_count: (c.unread_count || 0) + 1,
      last_message: replyText,
      last_message_at: incomingMsg.created_at
    } : c));
  };

  const toggleChatReaction = (messageId: string, emoji: string, userName: string) => {
    setChatMessages(prev => prev.map(m => {
      if (m.id !== messageId) return m;
      const reactions = m.reactions ? [...m.reactions] : [];
      const existing = reactions.find(r => r.emoji === emoji);
      if (existing) {
        if (existing.users.includes(userName)) {
          existing.users = existing.users.filter(u => u !== userName);
          existing.count = existing.users.length;
        } else {
          existing.users.push(userName);
          existing.count = existing.users.length;
        }
      } else {
        reactions.push({ emoji, count: 1, users: [userName] });
      }
      return { ...m, reactions: reactions.filter(r => r.count > 0) };
    }));
  };

  const markChatAsRead = (targetId: string, currentUserId: string) => {
    setChatMessages(prev => prev.map(m => {
      // Only mark messages received from the other person as read.
      // Sent messages stay as single tick ('sent') until the recipient reads them!
      if (!targetId.startsWith('chan-')) {
        if (m.sender_id === targetId && (m.recipient_id === currentUserId || m.recipient_id === 'usr-1')) {
          return { ...m, status: 'read' };
        }
      } else {
        if (m.recipient_id === targetId && m.sender_id !== currentUserId) {
          return { ...m, status: 'read' };
        }
      }
      return m;
    }));
    if (targetId.startsWith('chan-')) {
      setChatChannels(prev => prev.map(ch => ch.id === targetId ? { ...ch, unread_count: 0 } : ch));
    } else {
      setChatContacts(prev => prev.map(c => c.id === targetId ? { ...c, unread_count: 0 } : c));
    }
  };

  const updateUserPresence = (userId: string, isOnline: boolean, statusMessage?: string) => {
    setChatContacts(prev => prev.map(c => c.id === userId ? {
      ...c,
      is_online: isOnline,
      last_seen: isOnline ? 'Active now' : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status_message: statusMessage !== undefined ? statusMessage : c.status_message
    } : c));
  };

  const addChannelMember = (channelId: string, staffId: string) => {
    const staff = chatContacts.find(c => c.id === staffId);
    let channelName = '';
    setChatChannels(prev => prev.map(ch => {
      if (ch.id === channelId) {
        channelName = ch.name;
        const currentMembers = ch.member_ids || [];
        if (currentMembers.includes(staffId)) return ch;
        const updated = [...currentMembers, staffId];
        return {
          ...ch,
          member_ids: updated,
          members_count: updated.length
        };
      }
      return ch;
    }));

    if (staff) {
      const systemAnnouncement: ChatMessage = {
        id: 'msg-' + Date.now(),
        sender_id: 'system',
        sender_name: 'DIGI SCORE OS',
        sender_avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=250',
        sender_role: 'System',
        recipient_id: channelId,
        recipient_name: channelName || 'Channel',
        type: 'text',
        text: `➕ ${staff.full_name} (${staff.role}) joined #${channelName || 'channel'}`,
        created_at: new Date().toISOString(),
        status: 'read'
      };
      setChatMessages(prev => [...prev, systemAnnouncement]);
      pushNotification('Channel Updated', `${staff.full_name} was added to #${channelName}`, 'info');
    }
  };

  const removeChannelMember = (channelId: string, staffId: string) => {
    const staff = chatContacts.find(c => c.id === staffId);
    let channelName = '';
    setChatChannels(prev => prev.map(ch => {
      if (ch.id === channelId) {
        channelName = ch.name;
        const currentMembers = ch.member_ids || [];
        const updated = currentMembers.filter(id => id !== staffId);
        return {
          ...ch,
          member_ids: updated,
          members_count: updated.length
        };
      }
      return ch;
    }));

    if (staff) {
      const systemAnnouncement: ChatMessage = {
        id: 'msg-' + Date.now(),
        sender_id: 'system',
        sender_name: 'DIGI SCORE OS',
        sender_avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=250',
        sender_role: 'System',
        recipient_id: channelId,
        recipient_name: channelName || 'Channel',
        type: 'text',
        text: `➖ ${staff.full_name} was removed from #${channelName || 'channel'}`,
        created_at: new Date().toISOString(),
        status: 'read'
      };
      setChatMessages(prev => [...prev, systemAnnouncement]);
      pushNotification('Channel Updated', `${staff.full_name} was removed from #${channelName}`, 'warning');
    }
  };

  const createChannel = (name: string, description: string, memberIds: string[]): string => {
    const cleanName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
    const finalMemberIds = Array.from(new Set(['usr-1', ...memberIds]));
    const newId = 'chan-' + Date.now();
    const newChan: ChatChannel = {
      id: newId,
      name: cleanName,
      description: description.trim() || 'Agency collaboration channel',
      is_channel: true,
      avatar_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=250',
      member_ids: finalMemberIds,
      members_count: finalMemberIds.length,
      unread_count: 0,
      last_message: 'Channel created by Hamid Saneen',
      last_message_at: new Date().toISOString()
    };
    setChatChannels(prev => [...prev, newChan]);
    pushNotification('New Channel Created', `#${cleanName} created with ${finalMemberIds.length} members`, 'success');
    return newId;
  };

  const updateStaffPhoto = (staffIdOrEmail: string, newPhotoUrl: string) => {
    const target = staffIdOrEmail.toLowerCase();
    setChatContacts(prev => prev.map(c => 
      (c.id === staffIdOrEmail || c.email.toLowerCase() === target || c.full_name.toLowerCase() === target)
        ? { ...c, avatar_url: newPhotoUrl }
        : c
    ));
    setEmployees(prev => prev.map(e => 
      (e.id === staffIdOrEmail || e.email.toLowerCase() === target || `${e.first_name} ${e.last_name}`.toLowerCase() === target)
        ? { ...e, avatar_url: newPhotoUrl }
        : e
    ));
    setChatMessages(prev => prev.map(m => 
      (m.sender_id === staffIdOrEmail || m.sender_name.toLowerCase() === target)
        ? { ...m, sender_avatar: newPhotoUrl }
        : m
    ));
    pushNotification('Photo Updated', 'Staff photo updated successfully across all profile bars.', 'success');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  // Reset
  const resetToInitialData = () => {
    localStorage.clear();
    setEmployees(INITIAL_EMPLOYEES);
    setClients(INITIAL_CLIENTS);
    setLeads(INITIAL_LEADS);
    setDeals(INITIAL_DEALS);
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setContentItems(INITIAL_CONTENT);
    setInvoices(INITIAL_INVOICES);
    setQuotations(INITIAL_QUOTATIONS);
    setPayments(INITIAL_PAYMENTS);
    setExpenses(INITIAL_EXPENSES);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaves(INITIAL_LEAVES);
    setSalaries(INITIAL_SALARIES);
    setDocuments(INITIAL_DOCUMENTS);
    setCommunications(INITIAL_COMMUNICATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setChatChannels(INITIAL_CHAT_CHANNELS);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setChatContacts(INITIAL_STAFF_CONTACTS);
    pushNotification('Data Reset', 'All agency records have been reset to factory seed values.', 'info');
  };

  const clearAllData = () => {
    setCompanies([]);
    setClients([]);
    setLeads([]);
    setFollowups([]);
    setDeals([]);
    setProjects([]);
    setTasks([]);
    setContentItems([]);
    setInvoices([]);
    setQuotations([]);
    setPayments([]);
    setExpenses([]);
    setAttendance([]);
    setLeaves([]);
    setSalaries([]);
    setDocuments([]);
    setCommunications([]);
    setNotifications([]);
    setChatMessages([]);

    if (typeof window !== 'undefined') {
      [
        'companies', 'clients', 'leads', 'followups', 'deals',
        'projects', 'tasks', 'content', 'invoices', 'quotations',
        'payments', 'expenses', 'attendance', 'leaves', 'salaries',
        'documents', 'communications', 'notifications', 'chat_messages'
      ].forEach(k => {
        try {
          localStorage.removeItem(STORAGE_PREFIX + k);
        } catch (e) {
          // ignore
        }
      });
    }

    pushNotification('Data Cleared', 'All dummy and transactional records have been completely purged.', 'success');
  };

  return (
    <DataContext.Provider
      value={{
        departments,
        employees,
        companies,
        services,
        packages,
        clients,
        leads,
        followups,
        deals,
        projects,
        tasks,
        contentItems,
        invoices,
        quotations,
        payments,
        expenses,
        expenseCategories,
        attendance,
        leaves,
        salaries,
        documents,
        communications,
        notifications,

        addLead,
        updateLead,
        deleteLead,
        convertLeadToClient,

        addFollowup,
        completeFollowup,
        deleteFollowup,

        addCompany,
        deleteCompany,

        addDeal,
        updateDeal,
        updateDealStage,
        deleteDeal,

        addClient,
        updateClient,
        deleteClient,

        addProject,
        updateProject,
        deleteProject,

        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,

        addContentItem,
        updateContentItem,
        approveContent,
        requestContentChanges,
        deleteContentItem,

        addQuotation,
        updateQuotation,
        addInvoice,
        recordPayment,
        addExpense,
        deleteExpense,

        addEmployee,
        updateEmployee,
        punchAttendance,
        punchIn,
        punchOut,
        getStaffTodayAttendance,
        submitLeaveRequest,
        reviewLeaveRequest,
        markSalaryPaid,

        addDocument,
        deleteDocument,
        logCommunication,

        chatChannels,
        chatMessages,
        chatContacts,
        totalUnreadChatCount,
        sendChatMessage,
        toggleChatReaction,
        markChatAsRead,
        updateUserPresence,
        simulateIncomingMessage,
        addChannelMember,
        removeChannelMember,
        createChannel,
        updateStaffPhoto,

        markNotificationRead,
        markAllNotificationsRead,
        pushNotification,

        resetToInitialData,
        clearAllData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
