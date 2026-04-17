'use client';

import { useEffect, useState } from 'react';
import { HiPlus, HiTrash, HiPencil, HiX, HiCheck } from 'react-icons/hi';
import { getAuthToken } from '@/lib/auth';

interface MasterDocument {
  _id: string;
  key: string;
  label: string;
  description: string;
  isRequired: boolean;
  isActive: boolean;
  category: string;
}

export default function DocumentConfigPage() {
  const [documents, setDocuments] = useState<MasterDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const [editingDoc, setEditingDoc] = useState<MasterDocument | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    label: '',
    description: '',
    isRequired: true,
    isActive: true,
    category: 'driver'
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/master-documents', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setDocuments(data);
      } else {
        console.error('API Error:', data.error || 'Unknown error');
        setDocuments([]);
      }
    } catch (err: any) {
      console.error('Fetch Error:', err);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const method = editingDoc ? 'PATCH' : 'POST';
    const url = editingDoc ? `/api/admin/master-documents/${editingDoc._id}` : '/api/admin/master-documents';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setIsModalOpen(false);
        setEditingDoc(null);
        setFormData({ key: '', label: '', description: '', isRequired: true, isActive: true, category: 'driver' });
        setMessage({ type: 'success', text: `Document type ${editingDoc ? 'updated' : 'created'} successfully!` });
        fetchDocuments();
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save configuration' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const initiateDelete = (id: string) => {
    setDocToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!docToDelete) return;
    try {
      const res = await fetch(`/api/admin/master-documents/${docToDelete}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Configuration deleted successfully' });
        fetchDocuments();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to delete' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setIsDeleteModalOpen(false);
      setDocToDelete(null);
    }
  };

  const openEditModal = (doc: MasterDocument) => {
    setEditingDoc(doc);
    setFormData({
      key: doc.key,
      label: doc.label,
      description: doc.description,
      isRequired: doc.isRequired,
      isActive: doc.isActive,
      category: doc.category
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="bg-[#f8f9fa] dark:bg-slate-800/50 py-4 px-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Document Configurations</h2>
          <button
            onClick={() => { setEditingDoc(null); setFormData({ key: '', label: '', description: '', isRequired: true, isActive: true, category: 'driver' }); setIsModalOpen(true); setMessage(null); }}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all active:scale-95"
          >
            <HiPlus /> Add Document Type
          </button>
        </div>

        {message && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] min-w-[320px] animate-in slide-in-from-top-8 duration-500 transition-all">
             <div className={`px-6 py-3.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-2 flex items-center gap-3 backdrop-blur-md ${
               message.type === 'success' 
                ? 'bg-emerald-500/90 border-emerald-400 text-white' 
                : 'bg-rose-500/90 border-rose-400 text-white'
             }`}>
                <div className="bg-white/20 p-1.5 rounded-full">
                  {message.type === 'success' ? <HiCheck className="text-xl" /> : <HiX className="text-xl" />}
                </div>
                <span className="font-black uppercase tracking-widest text-[11px]">{message.text}</span>
             </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-left text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest border-r border-slate-200 dark:border-slate-700">Category</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest border-r border-slate-200 dark:border-slate-700">Label (Key)</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest border-r border-slate-200 dark:border-slate-700">Required</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest border-r border-slate-200 dark:border-slate-700">Status</th>
                <th className="px-6 py-4 text-center text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-bold italic animate-pulse uppercase">Loading configurations...</td></tr>
              ) : documents.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-bold italic uppercase">No document types configured</td></tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-3 border-r border-slate-200 dark:border-slate-700">
                      <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 border-r border-slate-200 dark:border-slate-700">
                      <div className="font-bold text-slate-800 dark:text-white">{doc.label}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Key: {doc.key}</div>
                    </td>
                    <td className="px-6 py-3 border-r border-slate-200 dark:border-slate-700 text-center">
                      {doc.isRequired ? <HiCheck className="text-emerald-500 mx-auto text-xl" /> : <HiX className="text-rose-400 mx-auto text-xl" />}
                    </td>
                    <td className="px-6 py-3 border-r border-slate-200 dark:border-slate-700">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${doc.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        {doc.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEditModal(doc)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><HiPencil /></button>
                        <button onClick={() => initiateDelete(doc._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><HiTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="bg-[#f8f9fa] dark:bg-slate-800/50 py-4 px-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-tight">{editingDoc ? 'Edit' : 'Add'} Document Type</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><HiX className="text-xl" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Category</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-bold text-sm"
                >
                  <option value="driver">Driver</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Label</label>
                  <input
                    type="text"
                    required
                    value={formData.label}
                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                    placeholder="e.g. Aadhar Card"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Unique Key</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingDoc}
                    value={formData.key}
                    onChange={(e) => setFormData({...formData, key: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                    placeholder="e.g. aadhar_card"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-bold text-sm disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Instructions for the user..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-bold text-sm h-24"
                />
              </div>
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.isRequired}
                    onChange={(e) => setFormData({...formData, isRequired: e.target.checked})}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-tight">Required</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-tight">Active</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Cancel</button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all uppercase tracking-widest text-xs shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                       Saving...
                    </div>
                  ) : 'Save Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm border border-slate-200 dark:border-slate-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-200 overflow-hidden text-center">
            <div className="p-8">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-800 shadow-sm">
                <HiTrash className="text-3xl text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight mb-2">Are you sure?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                This will permanently delete the document configuration. This action cannot be undone.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-5 flex gap-3 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all hover:shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-rose-200 dark:shadow-none transition-all active:scale-95"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
