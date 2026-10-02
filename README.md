# DIGI SCORE Business OS

> **One Platform. Complete Business Control.**  
> A production-ready Office Management + CRM + Agency Management SaaS Operating System crafted specifically for digital marketing and branding agencies, designed for DIGI SCORE and engineered with multi-tenant scalability.

---

## ⚡ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti, Recharts, jsPDF
- **Backend / Database:** Supabase, PostgreSQL 15+, Supabase Auth, Supabase Storage, Supabase Realtime, Row Level Security (RLS)
- **Architecture:** Component-based, API/service layer separated, Strict TypeScript, Reusable Components, Responsive Desktop/Tablet/Mobile

---

## 🚀 Quick Start

### 1. Run Development Server

```bash
cd "C:\Users\Hamid Saneen\.gemini\antigravity\scratch\digiscore-business-os"
npm run dev
```

Visit `http://localhost:5173` to explore the complete live platform.

### 2. Build for Production

```bash
npm run build
```

This compiles a minified and type-checked bundle in `/dist`.

---

## 🗄️ Supabase Cloud & PostgreSQL Database Setup

The platform includes full SQL migrations under `supabase/migrations/`:

1. Create a project at [supabase.com](https://supabase.com).
2. In the Supabase Dashboard, navigate to the **SQL Editor**.
3. Run `supabase/migrations/001_initial_schema.sql` to generate all 32+ normalized tables, indexes, triggers, and Row Level Security (RLS) policies.
4. Run `supabase/migrations/002_seed_data.sql` to populate initial departments, roles, services, agency packages, and system settings.
5. In your project, copy `.env.example` to `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Zero-Config Local Storage Fallback:**  
> If Supabase credentials are not provided immediately, DIGI SCORE Business OS boots with an offline persistent Local Storage Engine pre-hydrated with realistic Dubai/GCC agency data. All 16 modules, forms, modals, status changes, PDF generators, and filters function right out of the box!

---

## 📦 System Modules & Capabilities

### 1. Executive Dashboard
- **15 Real-time KPIs:** Total Leads, New Leads, Follow-ups Today, Open Deals, Won Deals, Active Clients, Active Projects, Pending Tasks, Overdue Tasks, Collected Revenue, Pending Payments, Monthly Expenses, Net Profit, Employee Attendance, Deliverables.
- **Interactive Visualizations:** Monthly Cash Flow & Profit Velocity (Recharts Area), Active Project Status (Donut Chart).
- **Actionable Operational Feeds:** Today's high-priority follow-ups, upcoming task deadlines, recent lead captures, and settlement ledger.

### 2. CRM & Lead Management
- Full lifecycle tracking: `New`, `Contacted`, `Qualified`, `Meeting`, `Proposal Sent`, `Negotiation`, `Won`, `Lost`.
- Prospect attributes: Company, Contact Person, Phone, WhatsApp, Email, Location, Industry, Lead Source, Interested Service, Estimated Budget, Assigned Salesperson, Follow-up Date, Executive Notes.
- One-click direct communication shortcuts (WhatsApp direct chat, Phone call, Email).
- 360° lead details drawer with touchpoints timeline.
- **One-Click Lead-to-Client Conversion:** Automatically transitions Won leads into active agency clients and generates a kickoff project sprint with celebratory confetti!

### 3. Interactive Sales Pipeline (Kanban)
- 8-stage drag & advance board: `New Lead` ➔ `Contacted` ➔ `Qualified` ➔ `Meeting` ➔ `Proposal` ➔ `Negotiation` ➔ `Won` ➔ `Lost`.
- Stage probability weighting (20% to 100%).
- Automatic real-time financial summaries: Total Active Pipeline Value, Won Revenue, Weighted Expected Revenue, and Lost Value.

### 4. Client Accounts & 360° Profiles
- Client directory with brand colors, contact channels, monthly retainer values, total billed LTV, and outstanding balances.
- Comprehensive 360° modal featuring:
  - Account Overview & Lifetime Value
  - Associated Projects & Sprints
  - Content Deliverables
  - Invoices & Settlements history

### 5. Services & Retainer Packages
- Pre-configured agency services: Brand Strategy & Identity, SMM, Graphic Design, Reels & Short-form Video Production, Meta Ads Performance Marketing, Google Ads PPC, Technical SEO, Custom Web Development.
- Monthly deliverable quota management: e.g. Growth Starter (8 posters, 4 reels), Scale Acceleration (16 posters, 8 reels, Meta Ads), Enterprise Dominance (24 posters, 16 reels, 4 cinema videos).

### 6. Projects & Sprints Workspace
- Project sprints with client association, package tier, budget, assigned Project Manager, start/end dates, and progress percentage sliders.
- Priority indicators: `Low`, `Medium`, `High`, `Urgent`.

### 7. Task Management Studio
- **3 Visual Modes:** List view, Kanban view, and Monthly Calendar schedule.
- Task status pipeline: `To Do` ➔ `In Progress` ➔ `Review` ➔ `Client Approval` ➔ `Completed`.
- Automated overdue task detection based on due dates.

### 8. Agency Content Studio & Quota Engine
- Supports multiple asset types: `Poster`, `Reel`, `Video`, `Story`, `Carousel`, `Ad Creative`, `Blog`.
- Content workflow states: `Idea` ➔ `Assigned` ➔ `Designing` ➔ `Internal Review` ➔ `Client Approval` ➔ `Approved` ➔ `Scheduled` ➔ `Published` ➔ `Rejected`.
- Real-time client quota counters (e.g. Posters: 12 / 16, Reels: 6 / 8).

### 9. Dedicated Client Portal
- Restricted client-facing view for external brand partners.
- Securely isolated: clients only see their own brand's projects, content assets, invoices, and contracts.
- One-click deliverable approval with feedback and revision request logging.

### 10. Quotation & Invoicing Engine (with PDF Generation)
- Quotations with itemized pricing, discounts, 5% UAE VAT, terms, and status progression (`Draft`, `Sent`, `Accepted`, `Rejected`).
- Invoices with payment balance auto-deductions.
- **Client-ready PDF Generation:** Generate and download official DIGI SCORE invoices with one click using `jsPDF`.

### 11. Payment Ledger & Settlements
- Multi-channel settlement tracking: `Bank Transfer`, `Card`, `UPI`, `Cash`, `Online Payment`.
- Transaction reference numbers and automatic invoice balance adjustment.

### 12. Operating Expense Management & P&L Statement
- Categorized overhead tracking: Office Rent, Staff Salaries, Software & SaaS, Marketing, Hardware, Utilities, Hospitality.
- Formal Profit & Loss (P&L) Statement with operating revenue vs. operating disbursements and CSV export.

### 13. HR Management, Biometric Attendance & Payroll
- Employee directory with emergency contacts, department assignments, and compensation records.
- Daily biometric punch-in / punch-out attendance console with working hours calculator.
- Leave requests workflow (`Annual`, `Sick`, `Casual`, `Maternity`, `Unpaid`) with administrative approvals.
- Monthly salary calculation: Basic Salary + Allowances + Bonuses - Unpaid Leave - Deductions = Net Salary.
- One-click Salary Slip PDF generation.

### 14. Document Storage Hub
- Centralized storage for Contracts, Agreements, Trade Licenses, Quotations, and Brand Assets.

### 15. Reports & Business Intelligence
- Conversion analytics, average deal size, on-time delivery rates, and sales velocity charts.
- Export all reports to CSV.

### 16. Roles & Row Level Security (RBAC)
- Multi-role switching support: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `SALES`, `ACCOUNTANT`, `DESIGNER`, `VIDEO_EDITOR`, `EMPLOYEE`, `CLIENT`.
- Tested permissions preventing unauthorized access at both the UI layer and PostgreSQL RLS layer.

---

## 🎨 Design System

- Primary Brand: **DIGI SCORE**
- Color Palette: Luminous Violet (`#7C3AED`), Deep Indigo (`#4F46E5`), Electric Fuchsia/Pink (`#EC4899`), Midnight Slate (`#0B0F19`), Cyber Emerald (`#10B981`), Amber Gold (`#F59E0B`).
- Glassmorphic card styling, responsive sidebar drawer, accessible high-contrast typography, and smooth micro-animations.

---

*DIGI SCORE Business OS — Built for growth, engineered for control.*
