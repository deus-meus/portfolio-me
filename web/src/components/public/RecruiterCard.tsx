import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Profile } from '../../types';

interface RecruiterCardProps {
  profile?: Profile | null;
}

export const RecruiterCard: React.FC<RecruiterCardProps> = ({ profile }) => {
  return (
    <div className="bg-white border border-brand-200 p-6 space-y-4">
      <div className="flex items-center justify-between pb-3.5 border-b border-brand-100">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 bg-emerald-500 flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white animate-pulse"></span>
          </div>
          <div>
            <h2 className="font-mono text-xs font-bold text-brand-900 uppercase tracking-wider">
              RECRUITER QUICK CARD
            </h2>
            <span className="font-mono text-[10px] text-brand-400 block">
              Verified Candidate Snapshot
            </span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 border border-emerald-200 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Open to Work
        </span>
      </div>

      <div className="space-y-2.5 font-mono text-xs">
        <div className="p-3 bg-brand-50/70 border border-brand-200/80 flex items-center justify-between">
          <span className="text-[11px] text-brand-500 font-medium uppercase">TARGET ROLE</span>
          <span className="text-[12px] font-bold text-brand-900">
            {profile?.role_title || "Backend Developer / Software Engineer"}
          </span>
        </div>

        <div className="p-3 bg-brand-50/70 border border-brand-200/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-brand-500 font-medium uppercase">
            <span>PRIMARY PRODUCTION STACK</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Production Grade
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {["TypeScript / Node", "NestJS", "Fastify", "PostgreSQL", "MongoDB", "Redis", "BullMQ", "Docker", "Go"].map((stack) => (
              <span
                key={stack}
                className="px-2 py-0.5 bg-white border border-brand-200 text-[11px] font-semibold text-brand-900"
              >
                {stack}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-brand-50/70 border border-brand-200/80">
            <span className="text-[10px] text-brand-500 uppercase block font-medium">EXPERIENCE</span>
            <span className="text-[13px] font-bold text-brand-900">
              {profile?.years_experience ? `${profile.years_experience}+ Years` : "2+ Years"}
            </span>
            <span className="text-[10px] text-brand-600 block mt-0.5">Backend Development</span>
          </div>
          <div className="p-3 bg-brand-50/70 border border-brand-200/80">
            <span className="text-[10px] text-brand-500 uppercase block font-medium">NOTICE PERIOD</span>
            <span className="text-[13px] font-bold text-emerald-700">
              {profile?.notice_period || "1 Month Notice"}
            </span>
            <span className="text-[10px] text-brand-600 block mt-0.5">Negotiable / Immediate</span>
          </div>
        </div>

        <div className="p-2.5 bg-brand-50/70 border border-brand-200/80 flex items-center justify-between">
          <span className="text-[10px] text-brand-500 uppercase font-medium">LOCATION & BASE</span>
          <span className="text-[11px] font-semibold text-brand-900">
            {profile?.location || "Denpasar, Bali • On-site, Hybrid & Remote (Relocation OK)"}
          </span>
        </div>

        <div className="p-2.5 bg-brand-50/70 border border-brand-200/80 flex items-center justify-between">
          <span className="text-[10px] text-brand-500 uppercase font-medium">DESIRED ROLE</span>
          <span className="text-[11px] font-semibold text-brand-900">Backend Developer / Software Engineer</span>
        </div>
      </div>

      <div className="pt-3.5 border-t border-brand-100 flex items-center justify-between font-mono text-[11px]">
        <span className="text-brand-500">DIRECT CONTACT</span>
        <a
          href={`mailto:${profile?.email || "dwinarwastu02@gmail.com"}`}
          className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 underline underline-offset-2"
        >
          {profile?.email || "dwinarwastu02@gmail.com"}
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
