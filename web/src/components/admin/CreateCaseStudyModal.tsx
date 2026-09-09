import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { CaseStudy } from '../../types';

interface CreateCaseStudyModalProps {
  initialData?: CaseStudy | null;
  onSave: (data: Partial<CaseStudy>) => Promise<void>;
  onClose: () => void;
}

export const CreateCaseStudyModal: React.FC<CreateCaseStudyModalProps> = ({
  initialData,
  onSave,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState<string>(initialData?.title || '');
  const [slug, setSlug] = useState<string>(initialData?.slug || '');
  const [domainCategory, setDomainCategory] = useState<string>(
    initialData?.domain_category || 'INFRASTRUCTURE & INTEGRATION'
  );
  const [badgeLabel, setBadgeLabel] = useState<string>(
    initialData?.badge_label || 'PRODUCTION GATEWAY'
  );
  const [githubUrl, setGithubUrl] = useState<string>(initialData?.github_url || '');
  const [docsUrl, setDocsUrl] = useState<string>(initialData?.docs_url || '');
  const [isPublished, setIsPublished] = useState<boolean>(
    initialData?.is_published !== undefined ? initialData.is_published : true
  );

  // STAR Text State
  const [problemsText, setProblemsText] = useState<string>(
    initialData?.problems_challenges?.join('\n') ||
      'Head-of-line blocking in legacy webhook queues caused by slow third-party endpoints.\nMandatory at-least-once delivery with HMAC signature verification without race conditions.'
  );
  const [solutionText, setSolutionText] = useState<string>(
    initialData?.architecture_solution?.join('\n') ||
      'Architected worker consumers utilizing BullMQ and Redis with dynamic concurrency scaling.\nEnforced signature verification strategies and automated DLQ replay tooling.'
  );

  // Flow & Stack State
  const [flowText, setFlowText] = useState<string>(
    initialData?.architecture_flow?.join(', ') ||
      'Client HTTP Webhook, HMAC Signature Verifier, BullMQ Message Queue, Redis Worker Pool, PostgreSQL Idempotent Ledger'
  );
  const [stackText, setStackText] = useState<string>(
    initialData?.tech_stack?.join(', ') || 'NestJS, BullMQ, Redis, PostgreSQL, Docker, TypeScript'
  );

  // Metrics State
  const [metrics, setMetrics] = useState(
    initialData?.metrics && initialData.metrics.length === 4
      ? initialData.metrics
      : [
          { label: 'Daily Throughput', value: '10M+ Events', delta: 'Zero loss guarantee' },
          { label: 'P99 Processing', value: '< 15ms', delta: 'Sub-millisecond verification' },
          { label: 'Memory Leak', value: '0 Leaks', delta: 'Stream-based processing' },
          { label: 'DLQ Recovery', value: '100%', delta: 'Automated replay tooling' },
        ]
  );

  const handleMetricChange = (index: number, field: string, val: string) => {
    const updated = [...metrics];
    updated[index] = { ...updated[index], [field]: val };
    setMetrics(updated);
  };

  const handleSubmit = async () => {
    if (!title || !slug) {
      setError('Title and Slug are required');
      setActiveTab(1);
      return;
    }

    setSaving(true);
    setError(null);

    const payload: Partial<CaseStudy> = {
      title,
      slug,
      domain_category: domainCategory,
      badge_label: badgeLabel,
      github_url: githubUrl,
      docs_url: docsUrl,
      is_published: isPublished,
      problems_challenges: problemsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      architecture_solution: solutionText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      architecture_flow: flowText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      tech_stack: stackText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      metrics,
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save case study');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-brand-200 shadow-xl flex flex-col font-sans my-auto max-h-[95vh]">
        {/* Modal Top Bar */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-brand-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-brand-900 shrink-0"></div>
            <h2 className="font-mono text-xs sm:text-sm font-bold text-brand-900 uppercase tracking-wider truncate">
              {initialData ? 'EDIT STAR CASE STUDY' : 'CREATE NEW STAR CASE STUDY'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-brand-400 hover:text-brand-900 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Tabs */}
        <div className="bg-brand-50 border-b border-brand-200 px-3 sm:px-6 flex items-center gap-1 font-mono text-xs overflow-x-auto whitespace-nowrap">
          {[
            { id: 1, label: '1. METADATA' },
            { id: 2, label: '2. STAR TEXT' },
            { id: 3, label: '3. METRICS' },
            { id: 4, label: '4. TECH & FLOW' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 border-b-2 font-semibold transition-colors shrink-0 ${
                activeTab === tab.id
                  ? 'border-brand-900 text-brand-900 bg-white'
                  : 'border-transparent text-brand-500 hover:text-brand-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mx-4 sm:mx-6 mt-3 sm:mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 1 && (
            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="block font-semibold uppercase text-brand-700 mb-1">
                  System Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Production-Grade Webhook Gateway"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!initialData) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }}
                  className="w-full bg-brand-50 border border-brand-300 p-2.5 text-brand-900 focus:outline-none focus:border-brand-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold uppercase text-brand-700 mb-1">
                    Slug (URL Key) *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-brand-50 border border-brand-300 p-2.5 text-brand-900 focus:outline-none focus:border-brand-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-brand-700 mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={badgeLabel}
                    onChange={(e) => setBadgeLabel(e.target.value)}
                    className="w-full bg-brand-50 border border-brand-300 p-2.5 text-brand-900 focus:outline-none focus:border-brand-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-brand-700 mb-1">
                  Domain Category
                </label>
                <input
                  type="text"
                  value={domainCategory}
                  onChange={(e) => setDomainCategory(e.target.value)}
                  className="w-full bg-brand-50 border border-brand-300 p-2.5 text-brand-900 focus:outline-none focus:border-brand-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold uppercase text-brand-700 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full bg-brand-50 border border-brand-300 p-2.5 text-brand-900 focus:outline-none focus:border-brand-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-brand-700 mb-1">
                    Live Web App / Docs URL
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. https://padelhive.dwin-studio.my.id"
                    value={docsUrl}
                    onChange={(e) => setDocsUrl(e.target.value)}
                    className="w-full bg-brand-50 border border-brand-300 p-2.5 text-brand-900 focus:outline-none focus:border-brand-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 accent-brand-900"
                />
                <label htmlFor="pub-check" className="font-semibold text-brand-800">
                  Published to Public Portfolio
                </label>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="block font-semibold uppercase text-brand-700 mb-1">
                  01. Problems & Challenges (One item per line)
                </label>
                <textarea
                  rows={4}
                  value={problemsText}
                  onChange={(e) => setProblemsText(e.target.value)}
                  className="w-full bg-brand-50 border border-brand-300 p-2.5 text-brand-900 focus:outline-none focus:border-brand-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-brand-700 mb-1">
                  02. Architecture Solution (One item per line)
                </label>
                <textarea
                  rows={4}
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value)}
                  className="w-full bg-brand-50 border border-brand-300 p-2.5 text-brand-900 focus:outline-none focus:border-brand-900 leading-relaxed"
                />
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-3 font-mono text-xs">
              <label className="block font-semibold uppercase text-brand-700">
                03. Quantifiable Impact & Tested Metrics (4 Cells)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {metrics.map((m, idx) => (
                  <div key={idx} className="p-3 bg-brand-50 border border-brand-200 space-y-2">
                    <div>
                      <span className="text-[10px] text-brand-500 uppercase block font-semibold">
                        Metric Label
                      </span>
                      <input
                        type="text"
                        value={m.label}
                        onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                        className="w-full bg-white border border-brand-300 px-2 py-1 text-xs text-brand-900"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-500 uppercase block font-semibold">
                        Value
                      </span>
                      <input
                        type="text"
                        value={m.value}
                        onChange={(e) => handleMetricChange(idx, 'value', e.target.value)}
                        className="w-full bg-white border border-brand-300 px-2 py-1 text-xs font-bold text-brand-900"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-500 uppercase block font-semibold">
                        Delta / Subtitle
                      </span>
                      <input
                        type="text"
                        value={m.delta}
                        onChange={(e) => handleMetricChange(idx, 'delta', e.target.value)}
                        className="w-full bg-white border border-brand-300 px-2 py-1 text-xs text-emerald-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 4 && (
            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="block font-semibold uppercase text-brand-700 mb-1">
                  Architecture Pipeline Flow Nodes (Comma separated)
                </label>
                <input
                  type="text"
                  value={flowText}
                  onChange={(e) => setFlowText(e.target.value)}
                  className="w-full bg-brand-50 border border-brand-300 p-2.5 text-brand-900 focus:outline-none focus:border-brand-900"
                />
                <span className="text-[11px] text-brand-500 mt-1 block">
                  Example: Client HTTP, HMAC Verifier, BullMQ, Redis Workers, Postgres
                </span>
              </div>

              <div>
                <label className="block font-semibold uppercase text-brand-700 mb-1">
                  Tech Stack Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={stackText}
                  onChange={(e) => setStackText(e.target.value)}
                  className="w-full bg-brand-50 border border-brand-300 p-2.5 text-brand-900 focus:outline-none focus:border-brand-900"
                />
                <span className="text-[11px] text-brand-500 mt-1 block">
                  Example: NestJS, BullMQ, Redis, PostgreSQL, Docker, TypeScript
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-brand-50 border-t border-brand-200 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-brand-300 text-brand-700 hover:bg-brand-100 font-semibold transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            {activeTab < 4 && (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab + 1)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-brand-200 text-brand-900 hover:bg-brand-300 font-semibold transition-colors"
              >
                Next Step →
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 sm:px-5 py-1.5 sm:py-2 bg-brand-900 text-white font-semibold hover:bg-brand-800 disabled:bg-brand-400 flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Case Study'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
