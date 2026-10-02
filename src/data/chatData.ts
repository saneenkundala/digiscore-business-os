import { ChatChannel, ChatMessage, StaffChatContact } from '../types';

export const INITIAL_CHAT_CHANNELS: ChatChannel[] = [
  {
    id: 'chan-general',
    name: 'general-agency',
    description: 'Company-wide updates, all-hands announcements and celebrations 🎉',
    is_channel: true,
    avatar_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=250',
    member_ids: ['usr-1', 'usr-2', 'usr-3', 'usr-4', 'usr-5', 'usr-6', 'usr-7', 'usr-8', 'usr-9', 'usr-10', 'usr-11'],
    members_count: 11,
    unread_count: 0
  },
  {
    id: 'chan-design',
    name: 'design-creatives',
    description: 'Visual identity, packaging 3D renders, ad creatives & UI/UX feedback',
    is_channel: true,
    avatar_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=250',
    member_ids: ['usr-1', 'usr-2', 'usr-4', 'usr-5', 'usr-9', 'usr-11'],
    members_count: 6,
    unread_count: 0
  },
  {
    id: 'chan-video',
    name: 'video-motion',
    description: 'Instagram reels, YouTube shorts, motion graphics & color grading',
    is_channel: true,
    avatar_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=250',
    member_ids: ['usr-1', 'usr-2', 'usr-4', 'usr-5', 'usr-6'],
    members_count: 5,
    unread_count: 0
  },
  {
    id: 'chan-sales',
    name: 'sales-growth',
    description: 'High-ticket deals, client proposals, retainers & revenue pipelines',
    is_channel: true,
    avatar_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=250',
    member_ids: ['usr-1', 'usr-2', 'usr-3', 'usr-6'],
    members_count: 4,
    unread_count: 0
  }
];

export const INITIAL_STAFF_CONTACTS: StaffChatContact[] = [
  {
    id: 'usr-1',
    full_name: 'Hamid Saneen',
    email: 'admin@digiscore.demo',
    role: 'Super Admin',
    department: 'Executive & Management',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
    is_online: true,
    last_seen: 'Active now',
    status_message: 'Leading executive strategy & client expansion 🚀',
    unread_count: 0
  },
  {
    id: 'usr-2',
    full_name: 'Sarah Al-Hashemi',
    email: 'manager@digiscore.demo',
    role: 'Operations Manager',
    department: 'Creative & Operations',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    is_online: false,
    last_seen: '10m ago',
    status_message: 'Managing sprint deliveries & client reviews 📋',
    unread_count: 0
  },
  {
    id: 'usr-3',
    full_name: 'Tariq Mansoor',
    email: 'sales@digiscore.demo',
    role: 'Sales Lead',
    department: 'Sales & Growth',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    is_online: false,
    last_seen: '30m ago',
    status_message: 'Closing corporate deals & proposals 💼',
    unread_count: 0
  },
  {
    id: 'usr-4',
    full_name: 'Maya Lin',
    email: 'designer@digiscore.demo',
    role: 'Senior Designer',
    department: 'Creative & Design',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    is_online: false,
    last_seen: '1h ago',
    status_message: 'In creative design flow 🎨',
    unread_count: 0
  },
  {
    id: 'usr-5',
    full_name: 'Rayyan Khan',
    email: 'video@digiscore.demo',
    role: 'Lead Video Producer',
    department: 'Video & Motion',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    is_online: false,
    last_seen: '2h ago',
    status_message: 'Editing 4K cinema footage & motion graphics 🎬',
    unread_count: 0
  },
  {
    id: 'usr-6',
    full_name: 'Elena Vasiliev',
    email: 'marketing@digiscore.demo',
    role: 'Marketing Executive',
    department: 'Digital Marketing & Ads',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    is_online: false,
    last_seen: '2h ago',
    status_message: 'Analyzing ad campaign performance & SEO 📊',
    unread_count: 0
  },
  {
    id: 'usr-7',
    full_name: 'Fatima Zahra',
    email: 'accountant@digiscore.demo',
    role: 'Financial Controller',
    department: 'Finance & Accounts',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    is_online: false,
    last_seen: '3h ago',
    status_message: 'Auditing books & tax compliance 💰',
    unread_count: 0
  },
  {
    id: 'usr-8',
    full_name: 'Zainab Rashid',
    email: 'hr@digiscore.demo',
    role: 'HR Lead',
    department: 'People & HR',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    is_online: false,
    last_seen: '4h ago',
    status_message: 'Talent coordination & team culture 🤝',
    unread_count: 0
  },
  {
    id: 'usr-9',
    full_name: 'Kareem Farooq',
    email: 'developer@digiscore.demo',
    role: 'Senior Developer',
    department: 'Technology & Dev',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    is_online: false,
    last_seen: 'Yesterday',
    status_message: 'Building technical architecture ⚡',
    unread_count: 0
  },
  {
    id: 'usr-10',
    full_name: 'Adil Nambiar',
    email: 'adil@digiscore.demo',
    role: 'Associate Director',
    department: 'Creative & Operations',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    is_online: false,
    last_seen: 'Yesterday',
    status_message: 'Client relations & brand roadmaps 🎯',
    unread_count: 0
  },
  {
    id: 'usr-11',
    full_name: 'Zayn Malik',
    email: 'zayn@digiscore.demo',
    role: 'Creative Associate',
    department: 'Creative & Operations',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    is_online: false,
    last_seen: 'Yesterday',
    status_message: 'Working on moodboards & creative references 💡',
    unread_count: 0
  }
];

// Clean Chat Messages (Empty for fresh start)
export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [];
