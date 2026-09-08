import React, { useState } from 'react';
import { Download, Mail, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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
  const { lang, toggleLang, t } = useLanguage();

  const navLinks = [
    { href: "#overview", label: t.navOverview },
    { href: "#tech-stack", label: t.navTechStack },
    { href: "#case-studies", label: t.navCaseStudies },
    { href: "#experience", label: t.navExperience },
    { href: "#credentials", label: t.navEducation },
    { href: "#api-playground", label: t.navApiPlayground },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2.5 flex items-center justify-between gap-4">
        {/* Brand / Identity */}
        <div className="flex items-center gap-3 min-w-0 shrink-0">
          <a href="#" className="flex flex-col min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-bold text-sm sm:text-base md:text-lg text-brand-900 tracking-tight leading-snug">
                {fullName}
              </span>
              <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[11px] font-mono font-semibold tracking-wider uppercase bg-brand-100 text-brand-800 border border-brand-200 self-start sm:self-auto shrink-0 whitespace-nowrap">
                {roleTitle}
              </span>
            </div>
            <span className="text-[11px] font-mono text-brand-500 hidden sm:block mt-0.5">
              RESTful APIs, Queues & Distributed Systems
            </span>
          </a>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-medium text-brand-600">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-brand-900 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-mono font-bold bg-brand-50 hover:bg-brand-100 text-brand-900 border border-brand-300 transition-colors shrink-0 shadow-xs"
            title={lang === 'en' ? 'Beralih ke Bahasa Indonesia' : 'Switch to English'}
          >
            <Globe className="w-3.5 h-3.5 text-brand-700" />
            <span className="tracking-tight">{lang === 'en' ? 'EN' : 'ID'}</span>
            <span className="text-[10px] text-brand-400 font-normal">| {lang === 'en' ? 'ID' : 'EN'}</span>
          </button>

          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold bg-brand-900 text-white hover:bg-brand-800 transition-colors whitespace-nowrap shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.downloadCv}</span>
          </a>
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white text-brand-800 border border-brand-300 hover:bg-brand-50 transition-colors whitespace-nowrap"
          >
            <Mail className="w-3.5 h-3.5" />
            {t.contactBtn}
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
              <span className="font-medium">
                {link.label}
              </span>
              <span className="text-brand-400 text-[10px]">→</span>
            </a>
          ))}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLang}
              className="w-1/2 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-100 text-brand-900 border border-brand-300 font-bold"
            >
              <Globe className="w-3.5 h-3.5 text-brand-700" />
              <span>Bahasa: {lang === 'en' ? 'EN' : 'ID'}</span>
            </button>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-1/2 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-50 text-brand-900 border border-brand-200 font-semibold"
            >
              <Mail className="w-3.5 h-3.5" />
              {t.directContact}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

