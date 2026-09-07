import React from 'react';
import { Download, ExternalLink, Mail, Cpu } from 'lucide-react';
import type { Profile } from '../../types';
import { RecruiterCard } from './RecruiterCard';

interface HeroProps {
  profile?: Profile | null;
}

export const Hero: React.FC<HeroProps> = ({ profile }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 border-b border-brand-200" id="overview">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Profile Headline & Value Proposition */}
        <div className="lg:col-span-7 flex flex-col space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold tracking-wide uppercase bg-brand-900 text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              BACKEND DEVELOPER
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono bg-white text-brand-700 border border-brand-200 font-medium">
              <span className="text-emerald-500 font-bold">●</span> Clean Architecture
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono bg-white text-brand-700 border border-brand-200 font-medium">
              <Cpu className="w-3.5 h-3.5 text-accent" /> Async Queues & Databases
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-bold text-brand-900 leading-[1.2] sm:leading-[1.18] tracking-tight">
            {profile?.headline || "Engineering Reliable RESTful APIs & Scalable Backend Systems."}
          </h1>

          <p className="text-sm sm:text-base text-brand-600 leading-relaxed font-normal">
            {profile?.bio ||
              "Backend Developer experienced in building backend systems using NestJS and Node.js, including real-time systems (Socket.IO) and data management with PostgreSQL, MongoDB, and Redis. Familiar with observability infrastructure (Grafana, Loki) and object storage (MinIO). Seeking a Backend Developer role."}
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
            <a
              href={profile?.resume_url || "/resume.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-brand-900 text-white text-xs font-semibold hover:bg-brand-800 transition-colors"
            >
              <Download className="w-4 h-4" /> Download CV (PDF)
            </a>
            <a
              href={profile?.github_url || "https://github.com/deus-meus"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 bg-white text-brand-800 border border-brand-300 text-xs font-semibold hover:bg-brand-50 hover:border-brand-400 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"></path></svg>
              GitHub
              <ExternalLink className="w-3 h-3 text-brand-400" />
            </a>
            <a
              href={profile?.linkedin_url || "https://linkedin.com/in/dwinarwastu"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 bg-white text-brand-800 border border-brand-300 text-xs font-semibold hover:bg-brand-50 hover:border-brand-400 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-[#0a66c2]" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
              LinkedIn
              <ExternalLink className="w-3 h-3 text-brand-400" />
            </a>
            <a
              href={`mailto:${profile?.email || "dwinarwastu02@gmail.com"}`}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 bg-white text-brand-800 border border-brand-300 text-xs font-semibold hover:bg-brand-50 hover:border-brand-400 transition-colors"
            >
              <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate max-w-[180px] xs:max-w-none">{profile?.email || "dwinarwastu02@gmail.com"}</span>
            </a>
          </div>

          {/* 4-Metric Impact Ribbon */}
          <div className="pt-4 border-t border-brand-200 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 font-mono text-xs">
            <div className="p-2.5 sm:p-3.5 bg-white border border-brand-200 hover:border-emerald-200 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-brand-500 uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider">Experience</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
              </div>
              <span className="font-bold text-brand-900 text-base sm:text-xl block tabular-nums">
                {profile?.years_experience ? `${profile.years_experience}+ Years` : "2+ Years"}
              </span>
              <span className="text-[10px] sm:text-[11px] text-brand-600 block mt-0.5">Backend Dev</span>
            </div>

            <div className="p-2.5 sm:p-3.5 bg-white border border-brand-200 hover:border-emerald-200 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-brand-500 uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider">Core Focus</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <span className="font-bold text-brand-900 text-base sm:text-xl block">
                REST APIs
              </span>
              <span className="text-[10px] sm:text-[11px] text-brand-600 block mt-0.5">Clean Arch</span>
            </div>

            <div className="p-2.5 sm:p-3.5 bg-white border border-brand-200 hover:border-emerald-200 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-brand-500 uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider">Databases</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <span className="font-bold text-brand-900 text-base sm:text-xl block">
                Postgres & Redis
              </span>
              <span className="text-[10px] sm:text-[11px] text-brand-600 block mt-0.5">Relational & Cache</span>
            </div>

            <div className="p-2.5 sm:p-3.5 bg-white border border-brand-200 hover:border-emerald-200 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-brand-500 uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider">Async Flow</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              </div>
              <span className="font-bold text-brand-900 text-base sm:text-xl block">
                Queues & Workers
              </span>
              <span className="text-[10px] sm:text-[11px] text-brand-600 block mt-0.5">Async Flow</span>
            </div>
          </div>
        </div>

        {/* Right Column: Recruiter Quick Card */}
        <div className="lg:col-span-5 w-full">
          <RecruiterCard profile={profile} />
        </div>
      </div>
    </section>
  );
};
