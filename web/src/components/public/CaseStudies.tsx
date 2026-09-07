import React from 'react';
import { ExternalLink, CheckCircle2, GitBranch } from 'lucide-react';
import type { CaseStudy } from '../../types';

interface CaseStudiesProps {
  caseStudies?: CaseStudy[];
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ caseStudies = [] }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-brand-200" id="case-studies">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-brand-200">
        <div>
          <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
            [02] PRODUCTION CASE STUDIES (STAR FORMAT)
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 mt-1">
            Production System Case Studies
          </h2>
        </div>
        <p className="text-sm text-brand-600 max-w-md mt-2 md:mt-0 font-normal">
          Real-world backend projects demonstrating Clean Architecture, asynchronous queues, database optimization, and type-safe APIs.
        </p>
      </div>

      <div className="space-y-6">
        {caseStudies.map((cs, idx) => (
          <article
            key={cs.slug || idx}
            className="bg-white border border-brand-200 p-6 shadow-sm hover:border-brand-300 transition-colors"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-semibold text-brand-600 uppercase">
                    {cs.domain_category}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {cs.badge_label}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-brand-900">{cs.title}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cs.tech_stack?.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs px-2.5 py-0.5 bg-brand-100 text-brand-800 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Architecture Pipeline Flow */}
            {cs.architecture_flow && cs.architecture_flow.length > 0 && (
              <div className="my-4 p-3 bg-brand-50 border border-brand-200 font-mono text-[11px] text-brand-700 flex flex-wrap items-center gap-2">
                <span className="text-brand-500 font-bold uppercase text-[10px] flex items-center gap-1">
                  <GitBranch className="w-3 h-3 text-accent" />
                  Pipeline:
                </span>
                {cs.architecture_flow.map((node, nIdx) => (
                  <React.Fragment key={nIdx}>
                    <span className="px-2 py-0.5 bg-white border border-brand-200 font-semibold text-brand-900">
                      {node}
                    </span>
                    {nIdx < cs.architecture_flow.length - 1 && (
                      <span className="text-brand-400">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* 3-Column STAR Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">
              {/* Column 1: Problems & Challenges */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-brand-900 uppercase">
                  <span className="text-brand-400">01.</span> Problems & Challenges
                </div>
                <ul className="space-y-2 text-xs text-brand-700 leading-relaxed">
                  {cs.problems_challenges?.map((prob, pIdx) => (
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
                  <span className="text-brand-400">02.</span> Architecture Solution
                </div>
                <ul className="space-y-2 text-xs text-brand-700 leading-relaxed">
                  {cs.architecture_solution?.map((sol, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-1.5">
                      <span className="text-brand-400 font-bold">•</span>
                      <span>{sol}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Tested Impact & Results */}
              <div className="space-y-3 bg-emerald-50/60 p-4 border border-emerald-200">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  03. Tested Impact & Results
                </div>
                <div className="grid grid-cols-2 gap-3 font-mono pt-1 border-t border-emerald-200/60">
                  {cs.metrics?.map((m, mIdx) => (
                    <div key={mIdx} className="bg-white/80 p-2.5 border border-emerald-100">
                      <span className="text-[10px] text-brand-500 uppercase tracking-wide block font-medium">
                        {m.label}
                      </span>
                      <span className="text-lg font-bold text-brand-900 block mt-0.5 tabular-nums">
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
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-brand-100 text-xs font-mono">
              {cs.github_url && (
                <a
                  href={cs.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-brand-900 hover:text-accent transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"></path></svg>
                  GitHub Repository
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
                    Architecture Blueprint
                    <ExternalLink className="w-3 h-3 text-brand-400" />
                  </a>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
