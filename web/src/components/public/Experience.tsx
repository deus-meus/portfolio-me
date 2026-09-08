import React from 'react';
import { Building2 } from 'lucide-react';
import type { Experience } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ExperienceProps {
  experiences?: Experience[];
}

export const ExperienceSection: React.FC<ExperienceProps> = ({ experiences = [] }) => {
  const { lang, t } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-12 border-t border-brand-200" id="experience">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-brand-200">
        <div>
          <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
            {t.expTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 mt-1">
            {t.expTitle}
          </h2>
        </div>
        <p className="text-sm text-brand-600 max-w-md mt-2 md:mt-0 font-normal">
          {t.expDesc}
        </p>
      </div>

      <div className="relative space-y-8 sm:space-y-10 before:absolute before:left-3.5 sm:before:left-5 before:-translate-x-1/2 before:top-6 before:bottom-6 before:w-px before:bg-brand-200">
        {experiences.map((exp, idx) => {
          // Key detection for ID overrides
          const isV2Fulltime = exp.company_tagline?.includes('V2') || exp.employment_type === 'Full-time';
          const overrideKey = isV2Fulltime ? 'saia-fulltime' : 'saia-intern';
          const override = lang === 'id' ? t.expOverrides[overrideKey] : undefined;

          const displayRole = override?.role_title || exp.role_title;
          const displayTagline = override?.company_tagline || exp.company_tagline;
          const displayType = override?.employment_type || exp.employment_type;
          const displayLoc = override?.location || exp.location;
          const displayFocus = override?.core_focus || exp.core_focus;
          const displayAchievements = override?.achievements || exp.achievements;
          const displayEndDate = exp.end_date || (lang === 'id' ? t.presentLabel : 'Present');

          return (
            <div key={exp.id || idx} className="relative flex items-start gap-2.5 sm:gap-6 group">
              {/* Timeline Node */}
              <div className="w-7 sm:w-10 shrink-0 flex items-center justify-center pt-1.5 z-10">
                {exp.is_active || idx === 0 ? (
                  <div className="w-7 h-7 rounded-full bg-brand-900 flex items-center justify-center border-2 border-white ring-2 ring-emerald-500 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center border-2 border-brand-300 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-brand-400"></span>
                  </div>
                )}
              </div>

              {/* Experience Card */}
              <div className="flex-1 min-w-0 bg-white border border-brand-200 p-4 sm:p-7 hover:border-brand-400 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3 pb-3.5 sm:pb-5 border-b border-brand-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                      <span className="font-mono text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {exp.start_date} — {displayEndDate}
                      </span>
                      <span className="font-mono text-[10px] sm:text-[11px] text-brand-500">•</span>
                      <span className="text-[10px] sm:text-[11px] font-mono text-brand-600 bg-brand-50 px-2 sm:px-2.5 py-0.5 border border-brand-200">
                        {displayType} • {displayLoc}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-brand-900 leading-snug">{displayRole}</h3>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 text-xs sm:text-sm text-brand-600 font-medium">
                      <Building2 className="w-4 h-4 text-brand-400 shrink-0" />
                      <span>{exp.company_name}</span>
                      {displayTagline && (
                        <>
                          <span className="text-brand-300 hidden xs:inline">|</span>
                          <span className="text-brand-500 text-xs">{displayTagline}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1 lg:pt-0 lg:max-w-xs lg:justify-end">
                    {exp.tech_stack?.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] sm:text-[11px] px-2 py-0.5 bg-brand-100 text-brand-800 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-brand-600 mt-3 sm:mt-4 leading-relaxed font-normal bg-brand-50/70 p-2.5 sm:p-3 border border-brand-200/80">
                  <strong className="text-brand-900 font-semibold">{t.coreFocusPrefix}</strong>
                  {displayFocus}
                </p>

                {/* Achievements Grid */}
                <div className="mt-3.5 sm:mt-4 grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                  {displayAchievements?.map((ach, aIdx) => (
                    <div
                      key={aIdx}
                      className="p-3 sm:p-3.5 bg-white border border-brand-200/90 space-y-1.5"
                    >
                      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-brand-900 flex items-center gap-1.5">
                          <span className="text-brand-500 font-mono font-bold">{ach.number}</span>
                          {ach.title}
                        </span>
                        <span className="font-mono text-[9px] sm:text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 self-start xs:self-auto shrink-0">
                          {ach.metric}
                        </span>
                      </div>
                      <p className="text-xs text-brand-600 leading-relaxed">{ach.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
