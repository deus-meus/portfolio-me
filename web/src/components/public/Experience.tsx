import React from 'react';
import { Building2 } from 'lucide-react';
import type { Experience } from '../../types';

interface ExperienceProps {
  experiences?: Experience[];
}

export const ExperienceSection: React.FC<ExperienceProps> = ({ experiences = [] }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-brand-200" id="experience">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-brand-200">
        <div>
          <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
            [03] WORK HISTORY
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 mt-1">
            Professional Experience
          </h2>
        </div>
        <p className="text-sm text-brand-600 max-w-md mt-2 md:mt-0 font-normal">
          Track record of backend technical execution, monolithic decomposition, and large-scale architectural ownership.
        </p>
      </div>

      <div className="relative space-y-10 before:absolute before:left-5 before:-translate-x-1/2 before:top-6 before:bottom-6 before:w-0.5 before:bg-brand-200">
        {experiences.map((exp, idx) => (
          <div key={exp.id || idx} className="relative flex items-start gap-4 sm:gap-6 group">
            {/* Timeline Node */}
            <div className="w-10 shrink-0 flex items-center justify-center pt-1 z-10">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-900 text-white flex items-center justify-center border-2 border-[#f8fafc] font-mono text-xs font-bold ring-2 ring-emerald-500 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
            </div>

            {/* Experience Card */}
            <div className="flex-1 min-w-0 bg-white border border-brand-200 p-6 sm:p-7 hover:border-brand-400 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-5 border-b border-brand-100">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {exp.start_date} — {exp.end_date || "Present"}
                    </span>
                    <span className="font-mono text-[11px] text-brand-500">•</span>
                    <span className="text-[11px] font-mono text-brand-600 bg-brand-50 px-2.5 py-0.5 border border-brand-200">
                      {exp.employment_type} • {exp.location}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-900">{exp.role_title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-brand-600 font-medium">
                    <Building2 className="w-4 h-4 text-brand-400" />
                    <span>{exp.company_name}</span>
                    {exp.company_tagline && (
                      <>
                        <span className="text-brand-300">|</span>
                        <span>{exp.company_tagline}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 lg:pt-0 lg:max-w-xs lg:justify-end">
                  {exp.tech_stack?.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[11px] px-2 py-0.5 bg-brand-100 text-brand-800 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-brand-600 mt-4 leading-relaxed font-normal bg-brand-50/70 p-3 border border-brand-200/80">
                <strong className="text-brand-900 font-semibold">Core Focus: </strong>
                {exp.core_focus}
              </p>

              {/* Achievements Grid */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {exp.achievements?.map((ach, aIdx) => (
                  <div
                    key={aIdx}
                    className="p-3.5 bg-white border border-brand-200/90 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-brand-900 flex items-center gap-1.5">
                        <span className="text-brand-500 font-mono font-bold">{ach.number}</span>
                        {ach.title}
                      </span>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {ach.metric}
                      </span>
                    </div>
                    <p className="text-xs text-brand-600 leading-relaxed">{ach.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
