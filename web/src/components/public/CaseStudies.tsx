import React, { useState, useMemo } from 'react';
import { ExternalLink, CheckCircle2, GitBranch, Filter, Globe } from 'lucide-react';
import type { CaseStudy } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface CaseStudiesProps {
  caseStudies?: CaseStudy[];
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ caseStudies = [] }) => {
  const { lang, t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filterOptions = useMemo(() => {
    const counts = {
      all: caseStudies.length,
      queues: caseStudies.filter((cs) => cs.tech_stack?.some((t) => /bullmq|redis|lua/i.test(t)) || /hookbridge|guardrail|notihub/i.test(cs.slug)).length,
      realtime: caseStudies.filter((cs) => cs.tech_stack?.some((t) => /socket|sse|pub\/sub/i.test(t)) || /notihub|nontonplus/i.test(cs.slug)).length,
      bun: caseStudies.filter((cs) => cs.tech_stack?.some((t) => /bun|elysia|prisma/i.test(t)) || cs.slug === 'padelhive').length,
      mongodb: caseStudies.filter((cs) => cs.tech_stack?.some((t) => /mongo/i.test(t)) || cs.slug === 'nontonplus-v2-backend').length,
    };

    return [
      { id: 'all', label: t.allProjects, count: counts.all },
      { id: 'queues', label: lang === 'id' ? 'Redis & Queues' : 'Redis & Queues', count: counts.queues },
      { id: 'realtime', label: lang === 'id' ? 'Real-Time & Webhooks' : 'Real-Time & Webhooks', count: counts.realtime },
      { id: 'bun', label: 'Bun & ElysiaJS', count: counts.bun },
      { id: 'mongodb', label: 'MongoDB & NoSQL', count: counts.mongodb },
    ];
  }, [caseStudies, lang, t]);

  const filteredCaseStudies = useMemo(() => {
    if (selectedFilter === 'all') return caseStudies;
    if (selectedFilter === 'queues') {
      return caseStudies.filter((cs) => cs.tech_stack?.some((t) => /bullmq|redis|lua/i.test(t)) || /hookbridge|guardrail|notihub/i.test(cs.slug));
    }
    if (selectedFilter === 'realtime') {
      return caseStudies.filter((cs) => cs.tech_stack?.some((t) => /socket|sse|pub\/sub/i.test(t)) || /notihub|nontonplus/i.test(cs.slug));
    }
    if (selectedFilter === 'bun') {
      return caseStudies.filter((cs) => cs.tech_stack?.some((t) => /bun|elysia|prisma/i.test(t)) || cs.slug === 'padelhive');
    }
    if (selectedFilter === 'mongodb') {
      return caseStudies.filter((cs) => cs.tech_stack?.some((t) => /mongo/i.test(t)) || cs.slug === 'nontonplus-v2-backend');
    }
    return caseStudies;
  }, [caseStudies, selectedFilter]);

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-12 border-t border-brand-200" id="case-studies">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-brand-200">
        <div>
          <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
            {t.caseStudiesTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 mt-1">
            {t.caseStudiesTitle}
          </h2>
        </div>
        <p className="text-sm text-brand-600 max-w-md mt-2 md:mt-0 font-normal">
          {t.caseStudiesDesc}
        </p>
      </div>

      {/* Interactive Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6 font-mono text-xs">
        <span className="text-brand-500 font-semibold mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-accent" />
          {t.filterBy}
        </span>
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelectedFilter(opt.id)}
            className={`px-2.5 sm:px-3 py-1.5 border transition-all flex items-center gap-1.5 font-medium ${
              selectedFilter === opt.id
                ? 'bg-brand-900 text-white border-brand-900 shadow-xs font-bold'
                : 'bg-white text-brand-700 border-brand-200 hover:border-brand-400 hover:bg-brand-50'
            }`}
          >
            <span>{opt.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 font-bold ${
                selectedFilter === opt.id
                  ? 'bg-emerald-400 text-brand-950'
                  : 'bg-brand-100 text-brand-600'
              }`}
            >
              {opt.count}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredCaseStudies.map((cs, idx) => {
          const override = lang === 'id' ? t.caseStudyOverrides[cs.slug] : undefined;
          const displayTitle = override?.title || cs.title;
          const displayDomain = override?.domain_category || cs.domain_category;
          const displayBadge = override?.badge_label || cs.badge_label;
          const displayProblems = override?.problems_challenges || cs.problems_challenges;
          const displaySolutions = override?.architecture_solution || cs.architecture_solution;
          const displayMetrics = override?.metrics || cs.metrics;

          return (
            <article
              key={cs.slug || idx}
              className="bg-white border border-brand-200 p-4 sm:p-6 shadow-sm hover:border-brand-300 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-3.5 sm:pb-4 border-b border-brand-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] sm:text-xs font-semibold text-brand-600 uppercase">
                      {displayDomain}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {displayBadge}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-brand-900 leading-snug">{displayTitle}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cs.tech_stack?.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 bg-brand-100 text-brand-800 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Architecture Pipeline Flow */}
              {cs.architecture_flow && cs.architecture_flow.length > 0 && (
                <div className="my-3 sm:my-4 p-2.5 sm:p-3 bg-brand-50 border border-brand-200 font-mono text-[10px] sm:text-[11px] text-brand-700 flex flex-nowrap sm:flex-wrap items-center gap-1.5 sm:gap-2 overflow-x-auto">
                  <span className="text-brand-500 font-bold uppercase text-[9px] sm:text-[10px] flex items-center gap-1 shrink-0">
                    <GitBranch className="w-3 h-3 text-accent" />
                    Pipeline:
                  </span>
                  {cs.architecture_flow.map((node, nIdx) => (
                    <React.Fragment key={nIdx}>
                      <span className="px-1.5 sm:px-2 py-0.5 bg-white border border-brand-200 font-semibold text-brand-900 shrink-0 whitespace-nowrap">
                        {node}
                      </span>
                      {nIdx < cs.architecture_flow.length - 1 && (
                        <span className="text-brand-400 shrink-0">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* 3-Column STAR Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 py-2">
                {/* Column 1: Problems & Challenges */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-brand-900 uppercase">
                    {t.colProblems}
                  </div>
                  <ul className="space-y-2 text-xs text-brand-700 leading-relaxed">
                    {displayProblems?.map((prob, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5">
                        <span className="text-brand-400 font-bold">•</span>
                        <span>{prob}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: Architecture Solution */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-brand-900 uppercase">
                    {t.colSolution}
                  </div>
                  <ul className="space-y-2 text-xs text-brand-700 leading-relaxed">
                    {displaySolutions?.map((sol, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-1.5">
                        <span className="text-brand-400 font-bold">•</span>
                        <span>{sol}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3: Tested Impact & Results */}
                <div className="space-y-3 bg-emerald-50/60 p-3 sm:p-4 border border-emerald-200">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {t.colResults}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 sm:gap-3 font-mono pt-1 border-t border-emerald-200/60">
                    {displayMetrics?.map((m, mIdx) => (
                      <div key={mIdx} className="bg-white/80 p-2.5 border border-emerald-100">
                        <span className="text-[10px] text-brand-500 uppercase tracking-wide block font-medium">
                          {m.label}
                        </span>
                        <span className="text-base sm:text-lg font-bold text-brand-900 block mt-0.5 tabular-nums">
                          {m.value}
                        </span>
                        <span className="text-[10px] text-emerald-700 block mt-0.5">
                          {m.delta}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Links */}
              {(() => {
                const liveUrl = cs.demo_url || (cs.slug === 'padelhive' ? 'https://padelhive.dwin-studio.my.id' : undefined);
                return (
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3 border-t border-brand-100 text-xs font-mono">
                    {liveUrl && (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-xs"
                      >
                        <Globe className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.liveDemoApp}</span>
                        <ExternalLink className="w-3 h-3 text-emerald-100 shrink-0" />
                      </a>
                    )}
                    {cs.github_url && (
                      <a
                        href={cs.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-brand-900 hover:text-accent transition-colors"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"></path></svg>
                        {t.githubRepo}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {cs.docs_url && (
                      <>
                        <span className="text-brand-300">•</span>
                        <a
                          href={cs.docs_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-900 transition-colors"
                        >
                          {t.archBlueprint}
                          <ExternalLink className="w-3 h-3 text-brand-400" />
                        </a>
                      </>
                    )}
                  </div>
                );
              })()}
            </article>
          );
        })}
      </div>
    </section>
  );
};
