import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Briefcase,
  Terminal,
  LogOut,
  ExternalLink,
  User,
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
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'case-studies', label: 'Case Studies', icon: FolderGit2 },
    { id: 'skills', label: 'Tech Stack', icon: Cpu },
    { id: 'experience', label: 'Work History', icon: Briefcase },
    { id: 'webhooks', label: 'Webhooks & API', icon: Terminal },
    { id: 'profile', label: 'Profile & Bio', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-brand-900 flex flex-col font-sans">
      {/* Top Console Bar */}
      <header className="bg-brand-900 text-white h-14 px-4 sm:px-6 flex items-center justify-between border-b border-brand-800">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-emerald-400 animate-pulse"></div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider">
            PORTFOLIO ENGINE // CMS CONSOLE
          </span>
          <span className="hidden sm:inline font-mono text-[11px] text-brand-400 bg-brand-800 px-2 py-0.5">
            USER: {username}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={onBackToSite}
            className="text-brand-300 hover:text-white flex items-center gap-1 transition-colors px-2 py-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Public View
          </button>
          <button
            onClick={onLogout}
            className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors px-2 py-1 border border-brand-800 hover:border-red-900"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="bg-white border border-brand-200 p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-900 text-white font-semibold'
                      : 'text-brand-700 hover:bg-brand-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-brand-500'}`} />
                  {item.label}
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
        <main className="flex-1 min-w-0 bg-white border border-brand-200 p-6 shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
};
