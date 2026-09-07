import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import type { CaseStudy } from '../../types';
import { CreateCaseStudyModal } from '../../components/admin/CreateCaseStudyModal';

export const AdminCaseStudies: React.FC = () => {
  const [list, setList] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CaseStudy | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.listAllCaseStudies();
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

  const handleSave = async (cs: Partial<CaseStudy>) => {
    if (editingItem) {
      await api.updateCaseStudy(editingItem.id, cs);
    } else {
      await api.createCaseStudy(cs);
    }
    await loadData();
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteCaseStudy(id);
      setDeletingId(null);
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
            CASE STUDY REGISTRY
          </span>
          <h1 className="text-xl font-bold text-brand-900 mt-0.5">
            STAR Architectural Case Studies
          </h1>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-900 text-white font-mono text-xs font-semibold hover:bg-brand-800 transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Create New STAR Case Study
        </button>
      </div>

      {loading ? (
        <div className="font-mono text-xs text-brand-500 py-8 text-center">Loading case studies...</div>
      ) : list.length === 0 ? (
        <div className="font-mono text-xs text-brand-500 py-8 text-center bg-brand-50 border border-brand-200">
          No case studies found. Click "Create New STAR Case Study" to add one.
        </div>
      ) : (
        <div className="border border-brand-200 overflow-x-auto shadow-sm">
          <table className="w-full text-left font-mono text-xs min-w-[550px]">
            <thead className="bg-brand-50 border-b border-brand-200 text-brand-700">
              <tr>
                <th className="p-3">Title & Domain</th>
                <th className="p-3">Slug / Category</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {list.map((cs) => (
                <tr key={cs.id} className="hover:bg-brand-50/50 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-brand-900">{cs.title}</div>
                    <div className="text-[11px] text-brand-500 font-normal mt-0.5">
                      {cs.tech_stack?.slice(0, 4).join(', ')}
                    </div>
                  </td>
                  <td className="p-3 text-brand-600">
                    <div>{cs.slug}</div>
                    <div className="text-[11px] text-brand-400">{cs.domain_category}</div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-[10px] font-semibold border ${
                        cs.is_published
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-brand-100 text-brand-600 border-brand-200'
                      }`}
                    >
                      {cs.is_published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {cs.github_url && (
                      <a
                        href={cs.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-brand-400 hover:text-brand-900 inline-block"
                        title="View Repo"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setEditingItem(cs);
                        setModalOpen(true);
                      }}
                      className="p-1 text-brand-600 hover:text-brand-900 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(cs.id)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <CreateCaseStudyModal
          initialData={editingItem}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-brand-200 p-6 space-y-4 font-mono">
            <h3 className="text-sm font-bold text-red-600 uppercase">
              CONFIRM DELETION
            </h3>
            <p className="text-xs text-brand-700 leading-relaxed">
              Are you sure you want to permanently delete this case study? This action will remove it from the public portfolio immediately.
            </p>
            <div className="pt-2 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3 py-1.5 bg-brand-100 text-brand-800 hover:bg-brand-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-1.5 bg-red-600 text-white hover:bg-red-700 font-semibold"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
