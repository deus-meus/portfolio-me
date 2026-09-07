import React, { useState } from 'react';
import { Download, Mail, Terminal, Menu, X } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navLinks = [
    { href: "#overview", label: "Overview" },
    { href: "#tech-stack", label: "Tech Stack" },
    { href: "#case-studies", label: "Case Studies" },
    { href: "#experience", label: "Experience" },
    { href: "#credentials", label: "Credentials" },
    { href: "#api-playground", label: "API Playground", isApi: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2.5 flex items-center justify-between gap-4">
        {/* Brand / Identity */}
        <div className="flex items-center gap-3 min-w-0 shrink-0">
          <a href="#" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-900 text-white flex items-center justify-center font-mono font-bold text-sm shrink-0 border border-brand-800 shadow-sm">
              N
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base text-brand-900 tracking-tight leading-none whitespace-nowrap">
                {fullName}
              </span>
              <span className="text-[11px] font-mono text-brand-500 mt-1 flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-brand-700">{roleTitle}</span>
                <span className="hidden xl:inline">• RESTful APIs & Distributed Systems</span>
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-medium text-brand-600">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-brand-900 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              {link.isApi && <Terminal className="w-3.5 h-3.5 text-accent" />}
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold bg-brand-900 text-white hover:bg-brand-800 transition-colors whitespace-nowrap shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CV (PDF)</span>
          </a>
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white text-brand-800 border border-brand-300 hover:bg-brand-50 transition-colors whitespace-nowrap"
          >
            <Mail className="w-3.5 h-3.5" />
            Contact
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-brand-700 hover:text-brand-900 border border-brand-200 hover:border-brand-400 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-brand-200 px-4 py-3 space-y-1 font-mono text-xs shadow-lg animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-brand-800 hover:bg-brand-50 border-b border-brand-100 last:border-b-0 transition-colors"
            >
              <span className="flex items-center gap-2 font-medium">
                {link.isApi && <Terminal className="w-3.5 h-3.5 text-accent" />}
                {link.label}
              </span>
              <span className="text-brand-400 text-[10px]">→</span>
            </a>
          ))}
          <div className="pt-2 flex items-center gap-2">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-50 text-brand-900 border border-brand-200 font-semibold"
            >
              <Mail className="w-3.5 h-3.5" />
              Direct Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
