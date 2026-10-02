import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './components/auth/LoginPage';
import { PermissionGuard } from './components/common/PermissionGuard';

// Module components
import { Dashboard } from './components/modules/dashboard/Dashboard';
import { CRMLeads } from './components/modules/crm/CRMLeads';
import { CRMFollowups } from './components/modules/crm/CRMFollowups';
import { CRMPipeline } from './components/modules/crm/CRMPipeline';
import { ClientsList } from './components/modules/clients/ClientsList';
import { CompaniesList } from './components/modules/clients/CompaniesList';
import { ProjectsAndTasks } from './components/modules/projects/ProjectsAndTasks';
import { ContentStudio } from './components/modules/content/ContentStudio';
import { FinanceModule } from './components/modules/finance/FinanceModule';
import { HRModule } from './components/modules/hr/HRModule';
import { DocumentsModule } from './components/modules/documents/DocumentsModule';
import { CommunicationModule } from './components/modules/communication/CommunicationModule';
import { ReportsModule } from './components/modules/reports/ReportsModule';
import { NotificationsModule } from './components/modules/notifications/NotificationsModule';
import { SettingsModule } from './components/modules/settings/SettingsModule';
import { ClientPortal } from './components/modules/portal/ClientPortal';
import { UserManagementModule } from './components/modules/users/UserManagementModule';

function MainApp() {
  const { isClient, role, isAuthenticated, currentUser, isImpersonating, impersonatedUser } = useAuth();
  const [currentModule, setCurrentModule] = useState<string>(() => {
    return isClient ? 'portal' : 'dashboard';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0);

  const handleNavigate = (module: string) => {
    if (module === 'dashboard' || module === 'portal') {
      // Increment refresh key to trigger complete remount and live re-calculation of dashboard metrics
      setDashboardRefreshKey(prev => prev + 1);
    }
    setCurrentModule(module);
  };

  // Automatically route according to role when perspective switches
  useEffect(() => {
    if (isClient) {
      handleNavigate('portal');
    } else {
      handleNavigate('dashboard');
    }
  }, [isClient, role, isImpersonating, impersonatedUser?.id]);

  // Handle Quick Add shortcuts from Header
  const handleOpenQuickAdd = (type: 'lead' | 'task' | 'content' | 'invoice' | 'expense') => {
    switch (type) {
      case 'lead':
        handleNavigate('crm-leads');
        break;
      case 'task':
        handleNavigate('projects-tasks');
        break;
      case 'content':
        handleNavigate('content-list');
        break;
      case 'invoice':
        handleNavigate('sales-invoices');
        break;
      case 'expense':
        handleNavigate('finance-expenses');
        break;
    }
  };

  // If user is not authenticated, render the high-end Login Page!
  if (!isAuthenticated || !currentUser) {
    return <LoginPage onLoginSuccess={() => handleNavigate(isClient ? 'portal' : 'dashboard')} />;
  }

  const renderModule = () => {
    // If in Client Portal mode
    if (isClient || currentModule === 'portal') {
      return (
        <PermissionGuard module="content" moduleName="Client Portal" onNavigateHome={() => handleNavigate('dashboard')}>
          <ClientPortal key={dashboardRefreshKey} currentModule={currentModule} onNavigate={handleNavigate} />
        </PermissionGuard>
      );
    }

    switch (currentModule) {
      case 'dashboard':
        return (
          <PermissionGuard module="dashboard" moduleName="Executive Dashboard" onNavigateHome={() => handleNavigate('dashboard')}>
            <Dashboard key={dashboardRefreshKey} onNavigate={handleNavigate} onOpenQuickAdd={handleOpenQuickAdd} />
          </PermissionGuard>
        );

      // CRM
      case 'crm':
      case 'crm-leads':
        return (
          <PermissionGuard module="leads" moduleName="CRM Leads" onNavigateHome={() => handleNavigate('dashboard')}>
            <CRMLeads key={currentModule} onNavigate={handleNavigate} externalSearch={searchQuery} />
          </PermissionGuard>
        );
      case 'crm-followups':
        return (
          <PermissionGuard module="followups" moduleName="Lead Follow-ups" onNavigateHome={() => handleNavigate('dashboard')}>
            <CRMFollowups key={currentModule} />
          </PermissionGuard>
        );
      case 'crm-deals':
      case 'crm-pipeline':
        return (
          <PermissionGuard module="pipeline" moduleName="Sales Pipeline" onNavigateHome={() => handleNavigate('dashboard')}>
            <CRMPipeline key={currentModule} onNavigate={handleNavigate} />
          </PermissionGuard>
        );

      // Clients
      case 'clients':
      case 'clients-all':
        return (
          <PermissionGuard module="clients" moduleName="Client Directory" onNavigateHome={() => handleNavigate('dashboard')}>
            <ClientsList key={currentModule} onNavigate={handleNavigate} />
          </PermissionGuard>
        );
      case 'clients-companies':
        return (
          <PermissionGuard module="companies" moduleName="Companies Directory" onNavigateHome={() => handleNavigate('dashboard')}>
            <CompaniesList key={currentModule} />
          </PermissionGuard>
        );

      // Sales
      case 'sales':
      case 'sales-quotations':
        return (
          <PermissionGuard module="quotations" moduleName="Sales Quotations" onNavigateHome={() => handleNavigate('dashboard')}>
            <FinanceModule key={currentModule} initialTab="quotations" onNavigate={handleNavigate} />
          </PermissionGuard>
        );
      case 'sales-invoices':
        return (
          <PermissionGuard module="invoices" moduleName="Tax Invoices" onNavigateHome={() => handleNavigate('dashboard')}>
            <FinanceModule key={currentModule} initialTab="invoices" onNavigate={handleNavigate} />
          </PermissionGuard>
        );
      case 'sales-payments':
        return (
          <PermissionGuard module="payments" moduleName="Payment Settlements" onNavigateHome={() => handleNavigate('dashboard')}>
            <FinanceModule key={currentModule} initialTab="payments" onNavigate={handleNavigate} />
          </PermissionGuard>
        );

      // Projects
      case 'projects':
      case 'projects-list':
        return (
          <PermissionGuard module="projects" moduleName="Projects Delivery" onNavigateHome={() => handleNavigate('dashboard')}>
            <ProjectsAndTasks key={currentModule} initialView="projects" onNavigate={handleNavigate} />
          </PermissionGuard>
        );
      case 'projects-tasks':
        return (
          <PermissionGuard module="tasks" moduleName="Tasks & Sprints" onNavigateHome={() => handleNavigate('dashboard')}>
            <ProjectsAndTasks key={currentModule} initialView="tasks" onNavigate={handleNavigate} />
          </PermissionGuard>
        );
      case 'projects-calendar':
        return (
          <PermissionGuard module="projects" moduleName="Project Calendar" onNavigateHome={() => handleNavigate('dashboard')}>
            <ProjectsAndTasks key={currentModule} initialView="calendar" onNavigate={handleNavigate} />
          </PermissionGuard>
        );

      // Content
      case 'content':
      case 'content-calendar':
        return (
          <PermissionGuard module="content" moduleName="Content Studio" onNavigateHome={() => handleNavigate('dashboard')}>
            <ContentStudio key={currentModule} initialView="calendar" onNavigate={handleNavigate} />
          </PermissionGuard>
        );
      case 'content-list':
        return (
          <PermissionGuard module="content" moduleName="Content Deliverables" onNavigateHome={() => handleNavigate('dashboard')}>
            <ContentStudio key={currentModule} initialView="list" onNavigate={handleNavigate} />
          </PermissionGuard>
        );
      case 'content-approvals':
        return (
          <PermissionGuard module="content_approval" moduleName="Content Approvals" onNavigateHome={() => handleNavigate('dashboard')}>
            <ContentStudio key={currentModule} initialView="approvals" onNavigate={handleNavigate} />
          </PermissionGuard>
        );

      // Finance
      case 'finance':
      case 'finance-revenue':
        return (
          <PermissionGuard module="finance" moduleName="Finance & Revenue" onNavigateHome={() => handleNavigate('dashboard')}>
            <FinanceModule key={currentModule} initialTab="revenue" onNavigate={handleNavigate} />
          </PermissionGuard>
        );
      case 'finance-expenses':
        return (
          <PermissionGuard module="expenses" moduleName="Expense Manager" onNavigateHome={() => handleNavigate('dashboard')}>
            <FinanceModule key={currentModule} initialTab="expenses" onNavigate={handleNavigate} />
          </PermissionGuard>
        );
      case 'finance-pnl':
        return (
          <PermissionGuard module="finance" moduleName="Profit & Loss Statement" onNavigateHome={() => handleNavigate('dashboard')}>
            <FinanceModule key={currentModule} initialTab="pnl" onNavigate={handleNavigate} />
          </PermissionGuard>
        );

      // HR
      case 'hr':
      case 'hr-employees':
        return (
          <PermissionGuard module="employees" moduleName="Employees Directory" onNavigateHome={() => handleNavigate('dashboard')}>
            <HRModule key={currentModule} initialTab="employees" onNavigate={handleNavigate} />
          </PermissionGuard>
        );
      case 'hr-attendance':
        return (
          <PermissionGuard module="attendance" moduleName="Biometric Attendance" onNavigateHome={() => handleNavigate('dashboard')}>
            <HRModule key={currentModule} initialTab="attendance" onNavigate={handleNavigate} />
          </PermissionGuard>
        );
      case 'hr-leave':
        return (
          <PermissionGuard module="leave" moduleName="Leave Approvals" onNavigateHome={() => handleNavigate('dashboard')}>
            <HRModule key={currentModule} initialTab="leave" onNavigate={handleNavigate} />
          </PermissionGuard>
        );
      case 'hr-salary':
        return (
          <PermissionGuard module="salary" moduleName="Payroll & Salary Slips" onNavigateHome={() => handleNavigate('dashboard')}>
            <HRModule key={currentModule} initialTab="salary" onNavigate={handleNavigate} />
          </PermissionGuard>
        );

      // Users & RBAC
      case 'users':
        return (
          <PermissionGuard module="users" moduleName="User & Role Management" onNavigateHome={() => handleNavigate('dashboard')}>
            <UserManagementModule key={currentModule} />
          </PermissionGuard>
        );

      // Documents, Communication, Reports, Notifications, Settings
      case 'documents':
        return (
          <PermissionGuard module="documents" moduleName="Document Vault" onNavigateHome={() => handleNavigate('dashboard')}>
            <DocumentsModule key={currentModule} />
          </PermissionGuard>
        );
      case 'communication':
        return (
          <PermissionGuard module="communication" moduleName="Communication Hub" onNavigateHome={() => handleNavigate('dashboard')}>
            <CommunicationModule key={currentModule} />
          </PermissionGuard>
        );
      case 'notifications':
        return (
          <PermissionGuard module="notifications" moduleName="Alert Notifications" onNavigateHome={() => handleNavigate('dashboard')}>
            <NotificationsModule key={currentModule} />
          </PermissionGuard>
        );
      case 'reports':
        return (
          <PermissionGuard module="reports" moduleName="BI Analytics & Reports" onNavigateHome={() => handleNavigate('dashboard')}>
            <ReportsModule key={currentModule} />
          </PermissionGuard>
        );
      case 'settings':
        return (
          <PermissionGuard module="settings" moduleName="System Settings" onNavigateHome={() => handleNavigate('dashboard')}>
            <SettingsModule key={currentModule} />
          </PermissionGuard>
        );

      default:
        return <Dashboard key={dashboardRefreshKey} onNavigate={handleNavigate} onOpenQuickAdd={handleOpenQuickAdd} />;
    }
  };

  return (
    <Layout
      currentModule={currentModule}
      onNavigate={handleNavigate}
      onOpenQuickAdd={handleOpenQuickAdd}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {renderModule()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}
