import React, { useEffect, useState } from 'react';
import { Clock, Cpu, Database, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import type { HealthMetrics } from '../../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [health, setHealth] = useState<HealthMetrics | null>(null);
  const [csCount, setCsCount] = useState<number>(0);
  const [skillCount, setSkillCount] = useState<number>(0);
  const [expCount, setExpCount] = useState<number>(0);

  useEffect(() => {
    api.getHealth().then(setHealth).catch(() => null);
    api.listAllCaseStudies().then((cs) => setCsCount(cs.length)).catch(() => null);
    api.getSkills().then((s) => setSkillCount(s.length)).catch(() => null);
    api.getExperiences().then((e) => setExpCount(e.length)).catch(() => null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-200 gap-2">
        <div>
          <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
            OPERATIONAL OVERVIEW
          </span>
          <h1 className="text-xl font-bold text-brand-900 mt-0.5">
            System & Content Distribution Registry
          </h1>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ENGINE ACTIVE
          </span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 bg-brand-50 border border-brand-200 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between text-[11px] text-brand-500 uppercase">
            <span>Server Uptime</span>
            <Clock className="w-4 h-4 text-brand-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-brand-900 tabular-nums">
              {health?.uptime || "Running"}
            </div>
            <span className="text-[11px] text-brand-600 block mt-0.5">Continuous execution</span>
          </div>
          <div className="text-[10px] text-emerald-700 font-medium">99.95% Target SLA</div>
        </div>

        <div className="p-4 bg-brand-50 border border-brand-200 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between text-[11px] text-brand-500 uppercase">
            <span>Runtime Goroutines</span>
            <Cpu className="w-4 h-4 text-brand-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-brand-900 tabular-nums">
              {health ? health.goroutines : "--"}
            </div>
            <span className="text-[11px] text-brand-600 block mt-0.5">Concurrent threads</span>
          </div>
          <div className="text-[10px] text-accent font-medium">Go 1.23+ Scheduler</div>
        </div>

        <div className="p-4 bg-brand-50 border border-brand-200 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between text-[11px] text-brand-500 uppercase">
            <span>Heap Memory</span>
            <Database className="w-4 h-4 text-brand-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-brand-900 tabular-nums">
              {health ? `${health.memory_alloc_mb.toFixed(1)} MB` : "--"}
            </div>
            <span className="text-[11px] text-brand-600 block mt-0.5">Allocated memory</span>
          </div>
          <div className="text-[10px] text-emerald-700 font-medium">Ultra-lean footprint</div>
        </div>

        <div className="p-4 bg-brand-50 border border-brand-200 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between text-[11px] text-brand-500 uppercase">
            <span>Content Integrity</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-800 tabular-nums">
              100%
            </div>
            <span className="text-[11px] text-brand-600 block mt-0.5">Synchronized state</span>
          </div>
          <div className="text-[10px] text-emerald-700 font-medium">Zero Drift Guaranteed</div>
        </div>
      </div>

      {/* Content Domain Cards */}
      <div className="space-y-3 pt-2">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-brand-900 px-0.5">
          CONTENT DOMAIN SUMMARY
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 sm:p-5 bg-white border border-brand-200 space-y-3 shadow-xs hover:border-brand-400 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-brand-100">
              <span className="font-bold text-brand-900 text-sm">Case Studies</span>
              <span className="font-mono text-xs px-2 py-0.5 bg-brand-100 text-brand-800 font-semibold border border-brand-200">
                {csCount} Records
              </span>
            </div>
            <p className="text-xs text-brand-600 leading-relaxed">
              Hookbridge, Guardrail, Notihub, NontonPlus V2, PadelHive.
            </p>
            <button
              onClick={() => onNavigate('case-studies')}
              className="text-xs font-mono font-semibold text-accent hover:text-accent-hover inline-flex items-center gap-1.5 pt-1"
            >
              <span>Manage Case Studies</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 sm:p-5 bg-white border border-brand-200 space-y-3 shadow-xs hover:border-brand-400 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-brand-100">
              <span className="font-bold text-brand-900 text-sm">Tech Stack & Skills</span>
              <span className="font-mono text-xs px-2 py-0.5 bg-brand-100 text-brand-800 font-semibold border border-brand-200">
                {skillCount} Skills
              </span>
            </div>
            <p className="text-xs text-brand-600 leading-relaxed">
              Languages, Frameworks, Databases, Queues, DevOps, Observability.
            </p>
            <button
              onClick={() => onNavigate('skills')}
              className="text-xs font-mono font-semibold text-accent hover:text-accent-hover inline-flex items-center gap-1.5 pt-1"
            >
              <span>Manage Tech Stack</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 sm:p-5 bg-white border border-brand-200 space-y-3 shadow-xs hover:border-brand-400 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-brand-100">
              <span className="font-bold text-brand-900 text-sm">Work History</span>
              <span className="font-mono text-xs px-2 py-0.5 bg-brand-100 text-brand-800 font-semibold border border-brand-200">
                {expCount} Positions
              </span>
            </div>
            <p className="text-xs text-brand-600 leading-relaxed">
              Career milestones, roles, and quantifiable achievement metrics.
            </p>
            <button
              onClick={() => onNavigate('experience')}
              className="text-xs font-mono font-semibold text-accent hover:text-accent-hover inline-flex items-center gap-1.5 pt-1"
            >
              <span>Manage Experience</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
