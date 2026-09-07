import React from 'react';
import { Terminal, Shield, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-brand-200 mt-12 sm:mt-20" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-brand-200">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-brand-900">Narwastu Dwi Nilan Bara' Allo</span>
              <span className="font-mono text-[10px] sm:text-[11px] px-2 py-0.5 bg-brand-100 text-brand-800 border border-brand-200 uppercase font-medium">
                Backend Systems
              </span>
            </div>
            <p className="text-xs text-brand-500 font-mono">
              Engineered with Go Clean Architecture, SQLite WAL, and Swiss Precision React UI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200 font-semibold text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              API Online: 99.95% SLA
            </span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-900 transition-colors border border-brand-200 px-2.5 py-1 text-[11px] sm:text-xs"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              Top
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-xs font-mono text-brand-500">
          <div>
            © {new Date().getFullYear()} Narwastu Dwi Nilan Bara' Allo. Built with Go & React.
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-brand-400" />
              Go 1.23+ // Chi Router
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-brand-400" />
              SQLite CGO-Free
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
