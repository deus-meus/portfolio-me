import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Profile } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { copyToClipboard } from '../../utils/clipboard';

interface RecruiterCardProps {
  profile?: Profile | null;
}

export const RecruiterCard: React.FC<RecruiterCardProps> = ({ profile }) => {
  const { lang, t } = useLanguage();
  const { showToast } = useToast();

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = profile?.email || "dwinarwastu02@gmail.com";
    copyToClipboard(email);
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

      <div className="space-y-3 font-mono text-xs">
        <div className="pb-2.5 border-b border-brand-100 flex items-center justify-between gap-2">
          <span className="text-[10px] sm:text-[11px] text-brand-500 font-semibold uppercase">{t.targetRoleLabel}</span>
          <span className="text-xs sm:text-[12px] font-bold text-brand-900 text-right">
            {profile?.role_title || t.targetRoleVal}
          </span>
        </div>

        <div className="py-2.5 border-b border-brand-100 space-y-2">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-brand-500 font-semibold uppercase">
            <span>{t.primaryStackLabel}</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[10px]">
              <CheckCircle2 className="w-3 h-3" /> {t.productionGrade}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {["TypeScript / Node", "NestJS", "Fastify", "PostgreSQL", "MongoDB", "Redis", "BullMQ", "Docker", "Go"].map((stack) => (
              <span
                key={stack}
                className="px-2 py-0.5 bg-brand-50 border border-brand-200 text-[10px] sm:text-[11px] font-semibold text-brand-900"
              >
                {stack}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 py-2.5 border-b border-brand-100">
          <div>
            <span className="text-[10px] text-brand-500 uppercase block font-semibold">{t.expLabel}</span>
            <span className="text-xs sm:text-[13px] font-bold text-brand-900 block mt-0.5">
              {profile?.years_experience ? `${profile.years_experience}+ ${lang === 'id' ? 'Tahun' : 'Years'}` : t.yearsExp}
            </span>
            <span className="text-[10px] text-brand-500 block">{t.yearsExpSub}</span>
          </div>
          <div>
            <span className="text-[10px] text-brand-500 uppercase block font-semibold">{t.noticePeriodLabel}</span>
            <span className="text-xs sm:text-[13px] font-bold text-emerald-700 block mt-0.5">
              {lang === 'id' ? t.noticePeriodVal : (profile?.notice_period || t.noticePeriodVal)}
            </span>
            <span className="text-[10px] text-brand-500 block">{t.noticePeriodSub}</span>
          </div>
        </div>

        <div className="pt-2 pb-1 space-y-0.5">
          <span className="text-[10px] text-brand-500 uppercase font-semibold block">{t.locationLabel}</span>
          <span className="text-xs font-semibold text-brand-900 block leading-snug">
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
