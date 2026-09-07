import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import type { Skill } from '../../types';

export const AdminSkills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newCategory, setNewCategory] = useState<string>('languages');
  const [newName, setNewName] = useState<string>('');
  const [adding, setAdding] = useState<boolean>(false);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const data = await api.getSkills();
      setSkills(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleAdd = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!newName) return;
    setAdding(true);
    try {
      await api.createSkill({
        category: newCategory,
        name: newName,
        is_featured: true,
        sort_order: 10,
      });
      setNewName('');
      await loadSkills();
    } catch (err: any) {
      alert(err.message || 'Failed to add skill');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteSkill(id);
      await loadSkills();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const categories = ['languages', 'frameworks', 'databases', 'queues', 'devops', 'observability'];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-brand-200">
        <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
          TECHNICAL COMPETENCY REGISTRY
        </span>
        <h1 className="text-xl font-bold text-brand-900 mt-0.5">
          Tech Stack & Domain Skills
        </h1>
      </div>

      {/* Add Skill Bar */}
      <form onSubmit={handleAdd} className="p-3.5 sm:p-4 bg-brand-50 border border-brand-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase text-brand-700 shrink-0">Category:</span>
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 sm:flex-none bg-white border border-brand-300 p-2 text-brand-900 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 w-full">
          <input
            type="text"
            required
            placeholder="Skill name (e.g. Go Chi, Kafka, Redis Streams)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full bg-white border border-brand-300 p-2 text-brand-900 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={adding}
          className="px-4 py-2 bg-brand-900 text-white font-semibold flex items-center justify-center gap-1 hover:bg-brand-800 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          {adding ? 'Adding...' : 'Add Skill'}
        </button>
      </form>

      {/* Skills Grouped */}
      {loading ? (
        <div className="font-mono text-xs text-brand-500 py-8 text-center">Loading skills...</div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => {
            const catSkills = skills.filter((s) => s.category.toLowerCase() === cat);
            return (
              <div key={cat} className="border border-brand-200 p-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-brand-100">
                  <span className="font-bold text-brand-900 uppercase">
                    {cat} ({catSkills.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {catSkills.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 border border-brand-200 text-brand-900"
                    >
                      <span>{s.name}</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        className="text-brand-400 hover:text-red-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
