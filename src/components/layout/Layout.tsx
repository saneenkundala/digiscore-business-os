import React, { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { cn } from '../../lib/utils';
import { ImpersonationBanner } from './ImpersonationBanner';

interface LayoutProps {
  currentModule: string;
  onNavigate: (module: string) => void;
  onOpenQuickAdd: (type: 'lead' | 'task' | 'content' | 'invoice' | 'expense') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentModule,
  onNavigate,
  onOpenQuickAdd,
  searchQuery,
  onSearchChange,
  children
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Impersonation Banner */}
      <ImpersonationBanner />

      <div className="flex-1 flex">
        {/* Sidebar (Desktop expandable/collapsible + Mobile sliding drawer) */}
        <Sidebar
          currentModule={currentModule}
          onNavigate={onNavigate}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Main Content Area */}
        <div
          className={cn(
            'flex-1 flex flex-col min-w-0 transition-all duration-300',
            isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          )}
        >
          <Header
            onToggleMobileMenu={() => setIsMobileOpen(true)}
            onOpenQuickAdd={onOpenQuickAdd}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onNavigate={onNavigate}
          />

          <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-28 md:pb-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300 touch-scroll">
            {children}
          </main>

          {/* Floating Mobile Bottom Navigation Bar (iPhone & Android) */}
          <MobileBottomNav
            currentModule={currentModule}
            onNavigate={onNavigate}
            onOpenMenu={() => setIsMobileOpen(true)}
          />
        </div>
      </div>
    </div>
  );
};
