-- ==============================================================================
-- DIGI SCORE Business OS — Seed Data Migration
-- Pre-populates realistic data for DIGI SCORE Agency
-- ==============================================================================

-- 1. ROLES
INSERT INTO public.roles (role_key, name, description, is_system) VALUES
('SUPER_ADMIN', 'Super Admin', 'Full system access and ownership', true),
('ADMIN', 'Admin', 'Operational administration and management', true),
('MANAGER', 'Project Manager', 'Oversees projects, tasks, content approvals and teams', true),
('SALES', 'Sales Executive', 'Manages leads, follow-ups, quotations and deals', true),
('ACCOUNTANT', 'Accountant / Finance', 'Manages invoices, payments, expenses, and payroll', true),
('DESIGNER', 'Graphic Designer', 'Designs creative assets, posters, carousels, and stories', true),
('VIDEO_EDITOR', 'Video Editor', 'Creates reels, promotional videos, and motion graphics', true),
('MARKETING_EXECUTIVE', 'Marketing Executive', 'Manages ad campaigns, copy, scheduling and client communication', true),
('EMPLOYEE', 'Staff Member', 'General employee workspace and task execution', true),
('CLIENT', 'Client User', 'Client portal access for approvals, invoices, and deliverables', true)
ON CONFLICT (role_key) DO NOTHING;

-- 2. DEPARTMENTS
INSERT INTO public.departments (id, name, code, description, color) VALUES
('d1111111-1111-1111-1111-111111111111', 'Executive & Management', 'EXEC', 'Agency Leadership and Strategic Operations', '#8B5CF6'),
('d2222222-2222-2222-2222-222222222222', 'Sales & Growth', 'SALES', 'Lead generation, business development and conversions', '#EC4899'),
('d3333333-3333-3333-3333-333333333333', 'Creative & Design', 'DESIGN', 'Branding, visual identity, UI/UX, and graphic design', '#6366F1'),
('d4444444-4444-4444-4444-444444444444', 'Video & Motion', 'VIDEO', 'Reels, YouTube production, 3D, and motion graphics', '#F43F5E'),
('d5555555-5555-5555-5555-555555555555', 'Digital Marketing & Ads', 'MKTG', 'Meta Ads, Google Ads, SEO, and Growth Hacking', '#10B981'),
('d6666666-6666-6666-6666-666666666666', 'Technology & Dev', 'TECH', 'Custom web apps, Shopify, landing pages and automation', '#3B82F6'),
('d7777777-7777-7777-7777-777777777777', 'Finance & Accounts', 'FIN', 'Billing, collections, payroll and financial governance', '#F59E0B'),
('d8888888-8888-8888-8888-888888888888', 'People & HR', 'HR', 'Talent acquisition, attendance, and team culture', '#06B6D4')
ON CONFLICT (code) DO NOTHING;

-- 3. SERVICES
INSERT INTO public.services (id, name, code, category, description, base_price) VALUES
('s1111111-1111-1111-1111-111111111111', 'Brand Strategy & Identity', 'BRAND-ID', 'Branding', 'Complete visual guidelines, logo, typography and voice', 4500.00),
('s2222222-2222-2222-2222-222222222222', 'Social Media Management (SMM)', 'SMM-CORE', 'Social Media', 'Content strategy, scheduling, daily community management', 3500.00),
('s3333333-3333-3333-3333-333333333333', 'Graphic Design & Ad Creatives', 'DESIGN-CREATIVE', 'Design', 'High-converting display ads, posters, banners, and brochures', 2800.00),
('s4444444-4444-4444-4444-444444444444', 'Short-form Video & Reels Production', 'VIDEO-REELS', 'Video', 'Scripting, filming direction, editing, motion captions and sound design', 4200.00),
('s5555555-5555-5555-5555-555555555555', 'Meta Ads Performance Marketing', 'ADS-META', 'Performance Marketing', 'ROAS-driven Facebook and Instagram ad management with pixel tracking', 3800.00),
('s6666666-6666-6666-6666-666666666666', 'Google Ads & Search Marketing', 'ADS-GOOGLE', 'Performance Marketing', 'PPC, Search, Display, and Performance Max campaign architecture', 3500.00),
('s7777777-7777-7777-7777-777777777777', 'Search Engine Optimization (SEO)', 'SEO-GROWTH', 'SEO', 'Technical audit, on-page optimization, backlink building and rank tracking', 3000.00),
('s8888888-8888-8888-8888-888888888888', 'Modern Web & Landing Page Dev', 'WEB-PRO', 'Development', 'Next.js / Vite custom responsive high-converting landing pages', 6500.00)
ON CONFLICT (code) DO NOTHING;

-- 4. PACKAGES
INSERT INTO public.packages (id, name, description, price, duration, is_custom, poster_quantity, reel_quantity, video_quantity, story_quantity, carousel_quantity, ad_management, seo, other_deliverables) VALUES
('p1111111-1111-1111-1111-111111111111', 'Growth Starter', 'Ideal for emerging brands establishing organic presence and engagement', 3500.00, 'Monthly', false, 8, 4, 1, 15, 2, false, false, 'Monthly analytics report + Bio optimization'),
('p2222222-2222-2222-2222-222222222222', 'Scale Acceleration', 'Our most popular retainership for aggressive social & performance growth', 6500.00, 'Monthly', false, 16, 8, 2, 30, 4, true, true, 'Meta Ads Management + Bi-weekly growth calls + Dedicated Slack channel'),
('p3333333-3333-3333-3333-333333333333', 'Enterprise Dominance', 'Omnichannel luxury brand presence, full video studio, and multi-platform ads', 12000.00, 'Monthly', false, 24, 16, 4, 45, 8, true, true, 'Full funnel Meta + Google Ads, Onsite video production, Dedicated Account Director');

-- 5. EXPENSE CATEGORIES
INSERT INTO public.expense_categories (name, description, is_recurring) VALUES
('Office Rent', 'Monthly prime commercial space lease', true),
('Staff Salary', 'Monthly payroll disbursements for agency team', true),
('Software & SaaS', 'Figma, Adobe Creative Cloud, Midjourney, OpenAI, Notion, Hosting', true),
('Internet & Utilities', 'High-speed fiber optics, electricity, water', true),
('Marketing & Ads', 'DIGI SCORE self-promotional lead gen ads', true),
('Equipment & Hardware', 'Cameras, Studio lighting, Apple M-series workstations', false),
('Travel & Client Meetings', 'Client hospitality, business travel, fuel', false),
('Miscellaneous', 'Office pantry, team events, stationary', false)
ON CONFLICT (name) DO NOTHING;

-- 6. SYSTEM SETTINGS
INSERT INTO public.settings (setting_key, setting_value, category, description) VALUES
('agency_profile', '{"name": "DIGI SCORE", "tagline": "One Platform. Complete Business Control.", "currency": "INR", "currency_symbol": "₹", "tax_rate": 18, "address": "Cyber City, Phase 2, Gurugram / MG Road, Bengaluru, India", "email": "contact@digiscore.agency", "phone": "+91 80 4000 5000", "website": "https://digiscore.agency"}'::jsonb, 'General', 'Agency Core Information'),
('email_settings', '{"sender_name": "DIGI SCORE Operations", "sender_email": "notifications@digiscore.agency", "smtp_configured": true}'::jsonb, 'Email', 'Outgoing notification configuration'),
('feature_flags', '{"client_portal_enabled": true, "realtime_chat_enabled": true, "kanban_auto_save": true, "multi_tenant_ready": true}'::jsonb, 'Features', 'System Feature Toggles')
ON CONFLICT (setting_key) DO NOTHING;
