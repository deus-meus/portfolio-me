import React from 'react';
import { Download, Mail, Terminal } from 'lucide-react';

interface HeaderProps {
  fullName?: string;
  roleTitle?: string;
  resumeUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  fullName = "Narwastu Dwi Nilan Bara' Allo",
  roleTitle = "Backend Developer",
  resumeUrl = "/resume.pdf",
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2.5 flex items-center justify-between gap-4">
        {/* Brand / Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <span className="font-bold text-base sm:text-lg text-brand-900 tracking-tight leading-snug">
                {fullName}
              </span>
              <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider uppercase bg-brand-100 text-brand-800 border border-brand-200 whitespace-nowrap">
                {roleTitle}
              </span>
            </div>
            <span className="text-[11px] font-mono text-brand-500 hidden md:block mt-0.5">
              RESTful APIs, Queues & Distributed Systems
            </span>
          </a>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-xs xl:text-sm font-medium text-brand-600">
          <a href="#overview" className="hover:text-brand-900 transition-colors whitespace-nowrap">Overview</a>
          <a href="#tech-stack" className="hover:text-brand-900 transition-colors whitespace-nowrap">Tech Stack</a>
          <a href="#case-studies" className="hover:text-brand-900 transition-colors whitespace-nowrap">Case Studies</a>
          <a href="#experience" className="hover:text-brand-900 transition-colors whitespace-nowrap">Experience</a>
          <a href="#credentials" className="hover:text-brand-900 transition-colors whitespace-nowrap">Credentials</a>
          <a href="#api-playground" className="hover:text-brand-900 transition-colors flex items-center gap-1 whitespace-nowrap">
            <Terminal className="w-3.5 h-3.5 text-accent" />
            API Playground
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold bg-brand-900 text-white hover:bg-brand-800 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Resume (PDF)
          </a>
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white text-brand-800 border border-brand-300 hover:bg-brand-50 transition-colors whitespace-nowrap"
          >
            <Mail className="w-3.5 h-3.5" />
            Contact
          </a>
        </div>
      </div>
    </header>
  );
};
