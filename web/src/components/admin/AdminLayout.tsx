import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Briefcase,
  Terminal,
  LogOut,
  ExternalLink,
  User,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  onBackToSite: () => void;
  username?: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  onBackToSite,
  username = 'admin',
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'case-studies', label: 'Case Studies', icon: FolderGit2 },
    { id: 'skills', label: 'Tech Stack', icon: Cpu },
    { id: 'experience', label: 'Work History', icon: Briefcase },
    { id: 'webhooks', label: 'Webhooks & API', icon: Terminal },
    { id: 'profile', label: 'Profile & Bio', icon: User },
  ];

  const activeNavItem = navItems.find((item) => item.id === currentTab) || navItems[0];
  const ActiveIcon = activeNavItem.icon;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-brand-900 flex flex-col font-sans">
      {/* Top Console Bar */}
      <header className="bg-brand-900 text-white min-h-14 py-2 px-3 sm:px-6 flex items-center justify-between border-b border-brand-800 gap-2 sticky top-0 z-50">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-2.5 h-2.5 bg-emerald-400 animate-pulse shrink-0"></div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider truncate">
            <span className="hidden xs:inline">PORTFOLIO ENGINE // </span>CMS CONSOLE
          </span>
          <span className="hidden md:inline font-mono text-[11px] text-brand-400 bg-brand-800 px-2 py-0.5">
            USER: {username}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs shrink-0">
          <button
            onClick={onBackToSite}
            className="text-brand-300 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 text-[11px] sm:text-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Public View</span>
            <span className="xs:hidden">Site</span>
          </button>
          <button
            onClick={onLogout}
            className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors px-2 py-1 border border-brand-800 hover:border-red-900 text-[11px] sm:text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Sign Out</span>
            <span className="xs:hidden">Exit</span>
          </button>
        </div>
      </header>

      {/* Mobile Selector Bar (Only on Mobile < 768px) */}
      <div className="md:hidden bg-white border-b border-brand-200 px-3 py-2 flex items-center justify-between font-mono text-xs shadow-xs sticky top-14 z-40">
        <div className="flex items-center gap-2 text-brand-900 font-bold">
          <ActiveIcon className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{activeNavItem.label}</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-900 text-white font-semibold text-xs transition-colors"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>NAV MENU</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-brand-200 px-3 py-2 space-y-1 font-mono text-xs shadow-lg sticky top-26 z-30 animate-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium transition-colors border-b border-brand-100 last:border-b-0 ${
                  isActive
                    ? 'bg-brand-900 text-white font-semibold'
                    : 'text-brand-800 hover:bg-brand-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-brand-500'}`} />
                  <span>{item.label}</span>
                </div>
                <span className="text-[10px] text-brand-400">→</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 gap-4 sm:gap-6">
        {/* Desktop Navigation Sidebar (Only on Desktop >= 768px) */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="bg-white border border-brand-200 p-2 flex flex-col gap-1 shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center justify-start gap-2 px-3 py-2 text-xs font-mono font-medium transition-colors w-full ${
                    isActive
                      ? 'bg-brand-900 text-white font-semibold shadow-xs'
                      : 'text-brand-700 hover:bg-brand-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-brand-500'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-white border border-brand-200 font-mono text-[11px] text-brand-600 space-y-1">
            <div className="text-[10px] text-brand-400 uppercase font-bold">SYSTEM ARCHITECTURE</div>
            <div>GO 1.23+ CHI</div>
            <div>SQLITE WAL ENGINE</div>
            <div className="text-emerald-700 font-semibold">100% ZERO DRIFT</div>
          </div>
        </aside>

        {/* Dynamic Content Panel */}
        <main className="flex-1 min-w-0 bg-white border border-brand-200 p-4 sm:p-6 shadow-xs">
          {children}
        </main>
      </div>
    </div>
  );
};
