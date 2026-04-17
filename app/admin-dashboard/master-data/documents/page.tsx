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
    <div className="-m-4 sm:-m-8">
      <div className="bg-white dark:bg-[#0A1128] min-h-[calc(100vh-64px)] transition-colors">
        <div className="bg-[#f8f9fa] dark:bg-slate-800/50 py-3.5 px-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
          <h2 className="text-sm md:text-xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tighter">
            Document Configurations
          </h2>
          <button
            onClick={() => { setEditingDoc(null); setFormData({ key: '', label: '', description: '', isRequired: true, isActive: true, category: 'driver' }); setIsModalOpen(true); setMessage(null); }}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-orange-200 dark:shadow-none"
          >
            <HiPlus className="text-lg" /> Add Document Type
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
              <tr className="bg-slate-50 dark:bg-slate-900/50">
                <th className="px-6 py-4 text-left text-[10px] font-black text-black dark:text-white uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-black dark:text-white uppercase tracking-widest">Document Label</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-black dark:text-white uppercase tracking-widest">Unique Key</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-black dark:text-white uppercase tracking-widest">Description</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-black dark:text-white uppercase tracking-widest">Required</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-black dark:text-white uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-black dark:text-white uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-0">
              {loading ? (
                <tr><td colSpan={7} className="py-20 text-center text-slate-400 font-black italic animate-pulse uppercase tracking-widest text-xs">Loading configurations...</td></tr>
              ) : documents.length === 0 ? (
                <tr><td colSpan={7} className="py-20 text-center text-slate-400 font-bold italic uppercase tracking-widest text-xs">No document types configured</td></tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-sm text-black dark:text-white uppercase tracking-tight">{doc.label}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-900/10 text-[10px] font-black text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-800/30 uppercase tracking-tighter">
                         {doc.key}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[200px]">
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 font-black leading-relaxed italic">{doc.description}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {doc.isRequired ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                             <HiCheck className="text-emerald-500 text-sm" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-900/20 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                             <HiX className="text-slate-300 text-sm" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${doc.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                         <span className={`text-[10px] font-black uppercase tracking-widest ${doc.isActive ? 'text-black dark:text-white' : 'text-slate-400'}`}>
                           {doc.isActive ? 'Active' : 'Inactive'}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEditModal(doc)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all border border-transparent hover:border-blue-100">
                          <HiPencil className="text-lg" />
                        </button>
                        <button onClick={() => initiateDelete(doc._id)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all border border-transparent hover:border-red-100">
                          <HiTrash className="text-lg" />
                        </button>
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="bg-[#f8f9fa] dark:bg-slate-800/50 py-4 px-8 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter text-lg">{editingDoc ? 'Edit' : 'Create'} Document Type</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><HiX className="text-xl" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Category</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all font-bold text-sm appearance-none cursor-pointer"
                >
                  <option value="driver">🚘 Driver Management</option>
                  <option value="vehicle">🚕 Vehicle Fleet</option>
                  <option value="employee">👥 Staff & Employees</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Label</label>
                  <input
                    type="text"
                    required
                    value={formData.label}
                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                    placeholder="e.g. Aadhar Card"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Unique Key</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingDoc}
                    value={formData.key}
                    onChange={(e) => setFormData({...formData, key: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                    placeholder="e.g. aadhar_card"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all font-bold text-sm disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed instructions for the user..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all font-bold text-sm h-24 resize-none"
                />
              </div>
              <div className="flex gap-8 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isRequired}
                      onChange={(e) => setFormData({...formData, isRequired: e.target.checked})}
                      className="sr-only"
                    />
                    <div className={`w-10 h-5 rounded-full transition-colors ${formData.isRequired ? 'bg-orange-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isRequired ? 'left-6' : 'left-1'}`}></div>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-orange-500 transition-colors">Required</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="sr-only"
                    />
                    <div className={`w-10 h-5 rounded-full transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isActive ? 'left-6' : 'left-1'}`}></div>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">Active</span>
                </label>
              </div>
              <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-6 rounded-2xl border border-slate-200 dark:border-slate-700 font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]">Back</button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-[2] py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-orange-200 dark:shadow-none disabled:opacity-50"
                >
                  {submitting ? 'Applying Changes...' : 'Save Configuration'}
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
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium text-balance">
                This will permanently delete the document configuration. This action cannot be undone.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-5 flex gap-3 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all hover:shadow-sm"
              >
                No, Keep it
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-rose-200 dark:shadow-none transition-all active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
