import React from 'react';
import { Award, CheckCircle2, ExternalLink } from 'lucide-react';
import type { Credential } from '../../types';

interface CredentialsProps {
  credentials?: Credential[];
}

export const CredentialsSection: React.FC<CredentialsProps> = ({ credentials = [] }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-brand-200" id="credentials">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-brand-200">
        <div>
          <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
            [04] CREDENTIALS & QUALIFICATIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 mt-1">
            Certifications & Education
          </h2>
        </div>
        <p className="text-sm text-brand-600 max-w-md mt-2 md:mt-0 font-normal">
          Formal university degree in computer science and verified technical specializations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {credentials.map((c, idx) => (
          <div
            key={c.id || idx}
            className="bg-white border border-brand-200 p-5 flex items-start justify-between gap-4 hover:border-brand-400 transition-colors"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-brand-50 border border-brand-200 text-brand-700">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-brand-900 text-base">{c.title}</h3>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                </div>
                <p className="text-xs text-brand-600 font-medium">{c.issuer}</p>
                <div className="flex items-center gap-3 font-mono text-xs text-brand-500 pt-1">
                  <span>ID: {c.credential_id}</span>
                  <span>•</span>
                  <span>Issued: {c.issue_date}</span>
                </div>
              </div>
            </div>

            {c.verification_url && (
              <a
                href={c.verification_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-brand-400 hover:text-brand-900 transition-colors border border-transparent hover:border-brand-200"
                title="Verify Credential"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
