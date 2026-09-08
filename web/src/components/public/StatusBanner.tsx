import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface StatusBannerProps {
  status?: string;
  location?: string;
  noticePeriod?: string;
  email?: string;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  status,
  location,
  noticePeriod,
  email = "dwinarwastu02@gmail.com",
}) => {
  const { t } = useLanguage();

  const displayStatus = status || t.status;
  const displayLocation = location || t.locationText;
  const displayNotice = noticePeriod || t.noticePeriodText;

  return (
    <div className="bg-brand-900 text-brand-200 text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 border-b border-brand-800">
      <div className="max-w-7xl mx-auto flex flex-wrap sm:flex-nowrap items-center justify-between gap-x-3 gap-y-1 font-mono">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="text-white font-medium truncate">STATUS: {displayStatus}</span>
          <span className="hidden md:inline text-brand-400 truncate">
            • {displayLocation} • {displayNotice}
          </span>
        </div>
        <div className="flex items-center gap-3 text-brand-300 shrink-0">
          <span className="hidden sm:inline text-brand-300">{t.backendPos}</span>
          <a
            href={`mailto:${email}`}
            className="text-emerald-400 hover:text-white underline underline-offset-2 font-medium transition-colors whitespace-nowrap"
          >
            {t.emailDirectly}
          </a>
        </div>
      </div>
    </div>
  );
};
