import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { api } from '../../services/api';
import type { Profile } from '../../types';

export const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getProfile()
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: keyof Profile, val: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: val });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      await api.updateProfile(profile);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="font-mono text-xs text-brand-500 py-8 text-center">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-brand-200">
        <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
          IDENTITY & POSITIONING
        </span>
        <h1 className="text-xl font-bold text-brand-900 mt-0.5">
          Public Profile & Recruiter Snapshot
        </h1>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Profile updated successfully! Live site reflects changes immediately.
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-mono text-xs">
          {error}
        </div>
      )}

      {profile && (
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase text-brand-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-brand-700 mb-1">Role Title</label>
              <input
                type="text"
                value={profile.role_title}
                onChange={(e) => handleChange('role_title', e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase text-brand-700 mb-1">Headline</label>
            <input
              type="text"
              value={profile.headline}
              onChange={(e) => handleChange('headline', e.target.value)}
              className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-brand-700 mb-1">Bio / Value Narrative</label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold uppercase text-brand-700 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-brand-700 mb-1">Availability Status</label>
              <input
                type="text"
                value={profile.availability_status}
                onChange={(e) => handleChange('availability_status', e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-brand-700 mb-1">Notice Period</label>
              <input
                type="text"
                value={profile.notice_period}
                onChange={(e) => handleChange('notice_period', e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="block font-semibold uppercase text-brand-700 mb-1">Years Experience</label>
              <input
                type="number"
                value={profile.years_experience}
                onChange={(e) => handleChange('years_experience', parseInt(e.target.value) || 0)}
                className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-brand-700 mb-1">Peak Throughput</label>
              <input
                type="text"
                value={profile.peak_rps}
                onChange={(e) => handleChange('peak_rps', e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-brand-700 mb-1">SLA Uptime</label>
              <input
                type="text"
                value={profile.sla_uptime}
                onChange={(e) => handleChange('sla_uptime', e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-brand-700 mb-1">P99 Latency</label>
              <input
                type="text"
                value={profile.p99_latency}
                onChange={(e) => handleChange('p99_latency', e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 p-2 text-brand-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-brand-200 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-brand-900 text-white font-semibold flex items-center gap-2 hover:bg-brand-800 disabled:bg-brand-400"
            >
              <Check className="w-4 h-4" />
              {saving ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
