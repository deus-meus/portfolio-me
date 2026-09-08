import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Profile } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

interface RecruiterCardProps {
  profile?: Profile | null;
}

export const RecruiterCard: React.FC<RecruiterCardProps> = ({ profile }) => {
  const { lang, t } = useLanguage();
  const { showToast } = useToast();

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = profile?.email || "dwinarwastu02@gmail.com";
    navigator.clipboard.writeText(email);
    showToast(t.emailCopied);
  };

  return (
    <div className="w-full bg-white border border-brand-200 p-3 sm:p-6 space-y-3 sm:space-y-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-brand-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 flex items-center justify-center shrink-0">
            <span className="w-1.5 h-1.5 bg-white animate-pulse"></span>
          </div>
          <div>
            <h2 className="font-mono text-xs font-bold text-brand-900 uppercase tracking-wider">
              {t.recruiterCardTitle}
            </h2>
            <span className="font-mono text-[10px] text-brand-400 block">
              {t.recruiterSnapshot}
            </span>
          </div>
        </div>
        <span className="text-[10px] xs:text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 sm:px-2.5 sm:py-1 border border-emerald-200 font-semibold flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          {t.openToWork}
        </span>
      </div>

      <div className="space-y-2.5 font-mono text-xs">
        <div className="p-2.5 sm:p-3 bg-brand-50/70 border border-brand-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span className="text-[10px] sm:text-[11px] text-brand-500 font-medium uppercase">{t.targetRoleLabel}</span>
          <span className="text-[11px] sm:text-[12px] font-bold text-brand-900">
            {profile?.role_title || t.targetRoleVal}
          </span>
        </div>

        <div className="p-2.5 sm:p-3 bg-brand-50/70 border border-brand-200/80 space-y-2">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-brand-500 font-medium uppercase">
            <span>{t.primaryStackLabel}</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[10px]">
              <CheckCircle2 className="w-3 h-3" /> {t.productionGrade}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {["TypeScript / Node", "NestJS", "Fastify", "PostgreSQL", "MongoDB", "Redis", "BullMQ", "Docker", "Go"].map((stack) => (
              <span
                key={stack}
                className="px-2 py-0.5 bg-white border border-brand-200 text-[10px] sm:text-[11px] font-semibold text-brand-900"
              >
                {stack}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          <div className="p-2.5 sm:p-3 bg-brand-50/70 border border-brand-200/80">
            <span className="text-[10px] text-brand-500 uppercase block font-medium">{t.expLabel}</span>
            <span className="text-[12px] sm:text-[13px] font-bold text-brand-900">
              {profile?.years_experience ? `${profile.years_experience}+ ${lang === 'id' ? 'Tahun' : 'Years'}` : t.yearsExp}
            </span>
            <span className="text-[10px] text-brand-600 block mt-0.5">{t.yearsExpSub}</span>
          </div>
          <div className="p-2.5 sm:p-3 bg-brand-50/70 border border-brand-200/80">
            <span className="text-[10px] text-brand-500 uppercase block font-medium">{t.noticePeriodLabel}</span>
            <span className="text-[12px] sm:text-[13px] font-bold text-emerald-700">
              {lang === 'id' ? t.noticePeriodVal : (profile?.notice_period || t.noticePeriodVal)}
            </span>
            <span className="text-[10px] text-brand-600 block mt-0.5">{t.noticePeriodSub}</span>
          </div>
        </div>

        <div className="p-2.5 sm:p-3 bg-brand-50/70 border border-brand-200/80 space-y-1">
          <span className="text-[10px] text-brand-500 uppercase font-medium block">{t.locationLabel}</span>
          <span className="text-[11px] sm:text-xs font-semibold text-brand-900 block leading-snug">
            {lang === 'id' ? t.locationVal : (profile?.location || t.locationVal)}
          </span>
        </div>
      </div>

      <div className="pt-3.5 border-t border-brand-100 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
        <span className="text-brand-500">{t.directContact}</span>
        <a
          href={`mailto:${profile?.email || "dwinarwastu02@gmail.com"}`}
          onClick={handleCopyEmail}
          title="Click to copy email address"
          className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 underline underline-offset-2 break-all cursor-pointer"
        >
          {profile?.email || "dwinarwastu02@gmail.com"}
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </a>
      </div>
    </div>
  );
};
