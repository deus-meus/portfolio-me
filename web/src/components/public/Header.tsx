import React from 'react';
import { Download, Mail, Terminal } from 'lucide-react';

interface HeaderProps {
  fullName?: string;
  roleTitle?: string;
  resumeUrl?: string;
  onNavigateToAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  fullName = "Dwinarwastu",
  roleTitle = "Backend Developer",
  resumeUrl = "/resume.pdf",
  onNavigateToAdmin,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="#" className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-brand-900 tracking-tight">{fullName}</span>
              <span className="px-2 py-0.5 text-[11px] font-mono font-medium tracking-wide uppercase bg-brand-100 text-brand-800 border border-brand-200">
                {roleTitle}
              </span>
            </div>
            <span className="text-[11px] font-mono text-brand-500 hidden sm:block">
              RESTful APIs, Queues & Distributed Systems
            </span>
          </a>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-brand-600">
          <a href="#overview" className="hover:text-brand-900 transition-colors">Overview</a>
          <a href="#tech-stack" className="hover:text-brand-900 transition-colors">Tech Stack</a>
          <a href="#case-studies" className="hover:text-brand-900 transition-colors">Case Studies</a>
          <a href="#experience" className="hover:text-brand-900 transition-colors">Experience</a>
          <a href="#credentials" className="hover:text-brand-900 transition-colors">Credentials</a>
          <a href="#api-playground" className="hover:text-brand-900 transition-colors flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-accent" />
            API Playground
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-brand-900 text-white hover:bg-brand-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Resume (PDF)
          </a>
          {onNavigateToAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-medium text-brand-700 bg-brand-100 hover:bg-brand-200 border border-brand-200 transition-colors"
            >
              CMS Console
            </button>
          )}
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-white text-brand-800 border border-brand-300 hover:bg-brand-50 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            Contact
          </a>
        </div>
      </div>
    </header>
  );
};
