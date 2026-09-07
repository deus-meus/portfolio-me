import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import type { Experience } from '../../types';
import { EditExperienceDrawer } from '../../components/admin/EditExperienceDrawer';

export const AdminExperience: React.FC = () => {
  const [list, setList] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getExperiences();
      setList(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (exp: Partial<Experience>) => {
    if (editingItem) {
      await api.updateExperience(editingItem.id, exp);
    } else {
      await api.createExperience(exp);
    }
    await loadData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this work experience?')) return;
    try {
      await api.deleteExperience(id);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-200 gap-3">
        <div>
          <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
            WORK HISTORY TIMELINE
          </span>
          <h1 className="text-xl font-bold text-brand-900 mt-0.5">
            Career Experience & Positions
          </h1>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setDrawerOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-900 text-white font-mono text-xs font-semibold hover:bg-brand-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Career Position
        </button>
      </div>

      {loading ? (
        <div className="font-mono text-xs text-brand-500 py-8 text-center">Loading experiences...</div>
      ) : list.length === 0 ? (
        <div className="font-mono text-xs text-brand-500 py-8 text-center bg-brand-50 border border-brand-200">
          No experience records found. Click "Add Career Position" to add one.
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((exp) => (
            <div
              key={exp.id}
              className="p-5 bg-white border border-brand-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs hover:border-brand-300 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand-900 text-sm">{exp.role_title}</span>
                  <span className="text-brand-400">•</span>
                  <span className="font-semibold text-brand-700">{exp.company_name}</span>
                  {exp.is_active && (
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-brand-500 text-[11px]">
                  {exp.start_date} — {exp.end_date || 'Present'} | {exp.employment_type} | {exp.location}
                </div>
                <p className="text-brand-600 font-sans text-xs pt-1 max-w-2xl line-clamp-2">
                  {exp.core_focus}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => {
                    setEditingItem(exp);
                    setDrawerOpen(true);
                  }}
                  className="px-3 py-1.5 bg-brand-100 hover:bg-brand-200 text-brand-800 flex items-center gap-1 font-semibold"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="px-2 py-1.5 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Drawer */}
      {drawerOpen && (
        <EditExperienceDrawer
          initialData={editingItem}
          onSave={handleSave}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
};
