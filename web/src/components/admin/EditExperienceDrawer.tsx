import React, { useState } from 'react';
import { X, Check, Plus, Trash } from 'lucide-react';
import type { Experience, ExperienceAchievement } from '../../types';

interface EditExperienceDrawerProps {
  initialData?: Experience | null;
  onSave: (data: Partial<Experience>) => Promise<void>;
  onClose: () => void;
}

export const EditExperienceDrawer: React.FC<EditExperienceDrawerProps> = ({
  initialData,
  onSave,
  onClose,
}) => {
  const [roleTitle, setRoleTitle] = useState<string>(initialData?.role_title || '');
  const [companyName, setCompanyName] = useState<string>(initialData?.company_name || '');
  const [companyTagline, setCompanyTagline] = useState<string>(initialData?.company_tagline || '');
  const [employmentType, setEmploymentType] = useState<string>(
    initialData?.employment_type || 'Full-time • Remote'
  );
  const [location, setLocation] = useState<string>(initialData?.location || 'Jakarta, Indonesia');
  const [startDate, setStartDate] = useState<string>(initialData?.start_date || '2023');
  const [endDate, setEndDate] = useState<string>(initialData?.end_date || 'Present');
  const [isActive, setIsActive] = useState<boolean>(initialData?.is_active || true);
  const [coreFocus, setCoreFocus] = useState<string>(
    initialData?.core_focus || 'Architected high-concurrency microservices, real-time WebSocket state synchronizer, and hybrid database architecture.'
  );
  const [techStackText, setTechStackText] = useState<string>(
    initialData?.tech_stack?.join(', ') || 'Go, NestJS, Fastify, Redis, PostgreSQL, MongoDB, WebSockets, Docker'
  );

  const [achievements, setAchievements] = useState<ExperienceAchievement[]>(
    initialData?.achievements || [
      { number: '01.', title: 'Socket Telemetry Engine', metric: '15k+ Conns', description: 'Architected socket server with Redis adapter, eliminating orphan session leaks.' },
      { number: '02.', title: 'Hybrid DB Migration', metric: '+65% Throughput', description: 'Decoupled playback telemetry writes to MongoDB while securing billing in PostgreSQL.' },
    ]
  );

  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAchievementChange = (idx: number, field: string, val: string) => {
    const updated = [...achievements];
    updated[idx] = { ...updated[idx], [field]: val };
    setAchievements(updated);
  };

  const handleAddAchievement = () => {
    const nextNum = `${(achievements.length + 1).toString().padStart(2, '0')}.`;
    setAchievements([...achievements, { number: nextNum, title: 'New Impact', metric: '+50%', description: 'Description of key architectural outcome' }]);
  };

  const handleRemoveAchievement = (idx: number) => {
    setAchievements(achievements.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!roleTitle || !companyName) {
      setError('Role Title and Company Name are required');
      return;
    }

    setSaving(true);
    setError(null);

    const payload: Partial<Experience> = {
      role_title: roleTitle,
      company_name: companyName,
      company_tagline: companyTagline,
      employment_type: employmentType,
      location,
      start_date: startDate,
      end_date: endDate,
      is_active: isActive,
      core_focus: coreFocus,
      achievements,
      tech_stack: techStackText.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white border-l border-brand-200 shadow-2xl flex flex-col h-full font-mono text-xs">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-brand-200 flex items-center justify-between bg-brand-50">
          <div>
            <h2 className="text-sm font-bold text-brand-900 uppercase">
              {initialData ? 'EDIT CAREER POSITION' : 'ADD NEW CAREER POSITION'}
            </h2>
            <span className="text-[10px] text-brand-500 block">
              Work History Timeline Configuration
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-brand-400 hover:text-brand-900 p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="m-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {/* Drawer Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase text-brand-700 mb-1">
                Role Title *
              </label>
              <input
                type="text"
                required
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none focus:border-brand-900"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-brand-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none focus:border-brand-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase text-brand-700 mb-1">
              Company Tagline / Domain
            </label>
            <input
              type="text"
              value={companyTagline}
              onChange={(e) => setCompanyTagline(e.target.value)}
              className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none focus:border-brand-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase text-brand-700 mb-1">
                Employment Type
              </label>
              <input
                type="text"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none focus:border-brand-900"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-brand-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none focus:border-brand-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase text-brand-700 mb-1">
                Start Date
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none focus:border-brand-900"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-brand-700 mb-1">
                End Date (or 'Present')
              </label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none focus:border-brand-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="active-role"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 accent-brand-900"
            />
            <label htmlFor="active-role" className="font-semibold text-brand-800">
              Current Active Position (Pulsing green indicator)
            </label>
          </div>

          <div>
            <label className="block font-semibold uppercase text-brand-700 mb-1">
              Core Focus Statement
            </label>
            <textarea
              rows={3}
              value={coreFocus}
              onChange={(e) => setCoreFocus(e.target.value)}
              className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none focus:border-brand-900"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-brand-700 mb-1">
              Tech Stack Badges (Comma separated)
            </label>
            <input
              type="text"
              value={techStackText}
              onChange={(e) => setTechStackText(e.target.value)}
              className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none focus:border-brand-900"
            />
          </div>

          {/* Achievements Sub-form */}
          <div className="space-y-3 pt-2 border-t border-brand-200">
            <div className="flex items-center justify-between">
              <label className="font-semibold uppercase text-brand-800">
                Key Architectural Achievements
              </label>
              <button
                type="button"
                onClick={handleAddAchievement}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-accent hover:text-accent-hover"
              >
                <Plus className="w-3.5 h-3.5" /> Add Metric
              </button>
            </div>

            {achievements.map((ach, idx) => (
              <div key={idx} className="p-3 bg-brand-50 border border-brand-200 space-y-2 relative">
                <button
                  type="button"
                  onClick={() => handleRemoveAchievement(idx)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Remove"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={ach.number}
                    onChange={(e) => handleAchievementChange(idx, 'number', e.target.value)}
                    className="bg-white border border-brand-300 p-1 text-xs"
                    placeholder="01."
                  />
                  <input
                    type="text"
                    value={ach.title}
                    onChange={(e) => handleAchievementChange(idx, 'title', e.target.value)}
                    className="col-span-2 bg-white border border-brand-300 p-1 text-xs font-semibold"
                    placeholder="Achievement Title"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={ach.metric}
                    onChange={(e) => handleAchievementChange(idx, 'metric', e.target.value)}
                    className="bg-white border border-brand-300 p-1 text-xs font-bold text-emerald-700"
                    placeholder="+40% Speed"
                  />
                  <input
                    type="text"
                    value={ach.description}
                    onChange={(e) => handleAchievementChange(idx, 'description', e.target.value)}
                    className="col-span-2 bg-white border border-brand-300 p-1 text-xs"
                    placeholder="Outcome description"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-brand-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-brand-100 hover:bg-brand-200 text-brand-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-brand-900 hover:bg-brand-800 text-white font-semibold flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Position'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
