'use client';

import { useEffect, useState } from 'react';
import { getAuthToken } from '@/lib/auth';
import {
  HiPencil, HiTrash, HiPlus, HiSearch, HiX, HiCheck, HiClipboardCopy,
  HiOutlineCloudUpload,
} from 'react-icons/hi';

interface Driver {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  role?: string;
  driverDetails?: {
    fullName?: string;
    mobile?: string;
    gender?: string;
    presentAddress?: string;
    permanentAddress?: string;
    alternateMobile?: string;
    aadhar?: string;
    dob?: string;
    pan?: string;
    email?: string;
    drivingLicense?: string;
    yearsOfExperience?: number;
    highestQualification?: string;
    profilePhoto?: string;
    aadharFront?: string;
    aadharBack?: string;
    panImage?: string;
    licenseImage?: string;
    kycStatus?: string;
  };
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; tempPassword?: string } | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const showToast = (message: string, type: 'success' | 'error', tempPassword?: string) => {
    setToast({ message, type, tempPassword });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDrivers = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch('/api/admin/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const usersArray = Array.isArray(data) ? data : data.employees || [];
        const driverList = usersArray.filter((emp: any) => emp.role === 'driver');
        setDrivers(driverList);
      } else {
        showToast(data.error || 'Failed to fetch drivers', 'error');
      }
    } catch (error) {
      showToast('Error fetching drivers', 'error');
    } finally {
      setLoading(false);
    }
  };

  // File upload handler (matches your existing upload API)
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const token = getAuthToken();
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data.url;
  };

  const handleFileUpload = async (field: string, file: File) => {
    setUploading(true);
    try {
      const url = await uploadFile(file, 'drivers');
      setFormData({ ...formData, [field]: url });
      showToast(`${field} uploaded successfully`, 'success');
    } catch (err) {
      showToast(`Failed to upload ${field}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    const payload = {
      email: formData.email,
      mobileNumber: formData.mobile,
      name: formData.fullName,
      role: 'driver',
      driverDetails: {
        fullName: formData.fullName,
        mobile: formData.mobile,
        gender: formData.gender,
        presentAddress: formData.presentAddress,
        permanentAddress: formData.permanentAddress,
        alternateMobile: formData.alternateMobile,
        aadhar: formData.aadhar,
        dob: formData.dob,
        pan: formData.pan,
        email: formData.email,
        drivingLicense: formData.drivingLicense,
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : undefined,
        highestQualification: formData.highestQualification,
        profilePhoto: formData.profilePhoto,
        aadharFront: formData.aadharFront,
        aadharBack: formData.aadharBack,
        panImage: formData.panImage,
        licenseImage: formData.licenseImage,
      },
    };
    try {
      const res = await fetch('/api/admin/create-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Driver created successfully!', 'success', data.temporaryPassword);
        fetchDrivers();
        closeModal();
      } else {
        showToast(data.error || 'Creation failed', 'error');
      }
    } catch (err) {
      showToast('Something went wrong', 'error');
    }
  };

  const handleUpdateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    const payload = {
      userId: editingDriver?._id,
      driverDetails: {
        fullName: formData.fullName,
        mobile: formData.mobile,
        gender: formData.gender,
        presentAddress: formData.presentAddress,
        permanentAddress: formData.permanentAddress,
        alternateMobile: formData.alternateMobile,
        aadhar: formData.aadhar,
        dob: formData.dob,
        pan: formData.pan,
        email: formData.email,
        drivingLicense: formData.drivingLicense,
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : undefined,
        highestQualification: formData.highestQualification,
        profilePhoto: formData.profilePhoto,
        aadharFront: formData.aadharFront,
        aadharBack: formData.aadharBack,
        panImage: formData.panImage,
        licenseImage: formData.licenseImage,
      },
    };
    try {
      const res = await fetch('/api/admin/update-driver', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showToast('Driver updated successfully', 'success');
        fetchDrivers();
        closeModal();
      } else {
        const data = await res.json();
        showToast(data.error || 'Update failed', 'error');
      }
    } catch (err) {
      showToast('Something went wrong', 'error');
    }
  };

  const handleDeleteDriver = async (id: string, name: string) => {
    if (!confirm(`Delete driver "${name}"?`)) return;
    const token = getAuthToken();
    try {
      const res = await fetch('/api/admin/delete-employee', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: id }),
      });
      if (res.ok) {
        showToast('Driver deleted', 'success');
        fetchDrivers();
      } else {
        const data = await res.json();
        showToast(data.error || 'Delete failed', 'error');
      }
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const openCreateModal = () => {
    setEditingDriver(null);
    setFormData({
      fullName: '',
      mobile: '',
      gender: '',
      presentAddress: '',
      permanentAddress: '',
      alternateMobile: '',
      aadhar: '',
      dob: '',
      pan: '',
      email: '',
      drivingLicense: '',
      yearsOfExperience: '',
      highestQualification: '',
      profilePhoto: '',
      aadharFront: '',
      aadharBack: '',
      panImage: '',
      licenseImage: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    const details = driver.driverDetails || {};
    setFormData({
      fullName: details.fullName || '',
      mobile: details.mobile || '',
      gender: details.gender || '',
      presentAddress: details.presentAddress || '',
      permanentAddress: details.permanentAddress || '',
      alternateMobile: details.alternateMobile || '',
      aadhar: details.aadhar || '',
      dob: details.dob ? new Date(details.dob).toISOString().split('T')[0] : '',
      pan: details.pan || '',
      email: details.email || '',
      drivingLicense: details.drivingLicense || '',
      yearsOfExperience: details.yearsOfExperience?.toString() || '',
      highestQualification: details.highestQualification || '',
      profilePhoto: details.profilePhoto || '',
      aadharFront: details.aadharFront || '',
      aadharBack: details.aadharBack || '',
      panImage: details.panImage || '',
      licenseImage: details.licenseImage || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDriver(null);
  };

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const filteredDrivers = drivers.filter(d =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.mobileNumber?.includes(searchTerm) ||
    d.driverDetails?.drivingLicense?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to render a document upload card
  const DocumentUploadCard = ({ title, description, field, accept = "image/*" }: { title: string; description: string; field: string; accept?: string }) => {
    const fileInputId = `upload-${field}`;
    const existingUrl = formData[field];
    return (
      <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center group hover:border-orange-200 dark:hover:border-orange-500/50 transition-colors">
        <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform mx-auto">
          <HiOutlineCloudUpload className="text-3xl text-slate-400 group-hover:text-orange-500 transition-colors" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{description}</p>
        {existingUrl && (
          <div className="mb-3">
            <img src={existingUrl} alt={title} className="max-h-24 mx-auto rounded-lg border border-slate-200 dark:border-slate-700" />
          </div>
        )}
        <input type="file" id={fileInputId} accept={accept} className="hidden" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(field, file);
        }} />
        <button
          type="button"
          onClick={() => document.getElementById(fileInputId)?.click()}
          disabled={uploading}
          className="px-6 py-2 bg-orange-600 dark:bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 dark:hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Browse Files'}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-[#0A1128] dark:via-[#0A1128] dark:to-[#0A1128] -mt-8 -mx-8 p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full max-w-md"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-[#0A1128] dark:via-[#0A1128] dark:to-[#0A1128] -mt-8 -mx-8">
      <div className="p-6 lg:p-8 space-y-6">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-top-5 duration-300 ${
            toast.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
          }`}>
            {toast.type === 'success' ? <HiCheck className="w-5 h-5" /> : <HiX className="w-5 h-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
            {toast.tempPassword && (
              <button onClick={() => copyPassword(toast.tempPassword!)} className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow">
                {copySuccess ? <HiCheck className="w-3.5 h-3.5" /> : <HiClipboardCopy className="w-3.5 h-3.5" />}
                {copySuccess ? 'Copied!' : 'Copy Password'}
              </button>
            )}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              Drivers Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage driver profiles, KYC, and personal documents</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 dark:shadow-none transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <HiPlus className="text-lg" /> Add Driver
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input
            type="text"
            placeholder="Search by name, email, mobile or license..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-400 dark:text-white outline-none text-sm shadow-sm"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white dark:bg-slate-900/50 rounded-2xl shadow-xl shadow-slate-100 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">License No.</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Experience (Yrs)</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">KYC Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {filteredDrivers.map((driver) => (
                  <tr key={driver._id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-sm flex items-center justify-center shadow-sm">
                          {driver.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-white">{driver.name || '-'}</div>
                          <div className="text-xs text-slate-400 dark:text-slate-500">{driver.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{driver.mobileNumber}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{driver.driverDetails?.drivingLicense || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{driver.driverDetails?.yearsOfExperience || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
                        driver.driverDetails?.kycStatus === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800' :
                        driver.driverDetails?.kycStatus === 'rejected' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 ring-1 ring-rose-200 dark:ring-rose-800' :
                        driver.driverDetails?.kycStatus === 'submitted' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800' :
                        'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800'
                      }`}>
                        {driver.driverDetails?.kycStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(driver)} className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all duration-200 group-hover:scale-105">
                          <HiPencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteDriver(driver._id, driver.name)} className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all duration-200 group-hover:scale-105">
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Total drivers: {drivers.length}</span>
            <span>Showing {filteredDrivers.length} of {drivers.length}</span>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredDrivers.map((driver) => (
            <div key={driver._id} className="bg-white dark:bg-slate-900/50 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 dark:text-white">{driver.name || '-'}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{driver.email}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{driver.mobileNumber}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-400 dark:text-slate-500">
                    <span>License: {driver.driverDetails?.drivingLicense || '-'}</span>
                    <span>Exp: {driver.driverDetails?.yearsOfExperience || '-'} yrs</span>
                  </div>
                  <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    driver.driverDetails?.kycStatus === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                    driver.driverDetails?.kycStatus === 'rejected' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' :
                    'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  }`}>
                    {driver.driverDetails?.kycStatus || 'pending'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(driver)} className="p-2 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg">
                    <HiPencil className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDeleteDriver(driver._id, driver.name)} className="p-2 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg">
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredDrivers.length === 0 && <div className="text-center py-12 text-slate-500">No drivers found</div>}
        </div>

        {/* Modal – Driver form with card-style document uploads */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={closeModal}>
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-200 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                  {editingDriver ? 'Edit Driver' : 'Add New Driver'}
                </h2>
                <button onClick={closeModal} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                  <HiX className="text-2xl" />
                </button>
              </div>

              <form onSubmit={editingDriver ? handleUpdateDriver : handleCreateDriver} className="p-6 space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-400">Full Name *</label><input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="mt-1 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 dark:text-white outline-none" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-400">Mobile Number *</label><input type="tel" required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="mt-1 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-400">Gender *</label><select required value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="mt-1 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 outline-none"><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-400">Present Address *</label><input type="text" required value={formData.presentAddress} onChange={e => setFormData({...formData, presentAddress: e.target.value})} className="mt-1 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-400">Permanent Address *</label><input type="text" required value={formData.permanentAddress} onChange={e => setFormData({...formData, permanentAddress: e.target.value})} className="mt-1 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-400">Alternate Mobile (optional)</label><input type="tel" value={formData.alternateMobile} onChange={e => setFormData({...formData, alternateMobile: e.target.value})} className="mt-1 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-400">Aadhar Number *</label><input type="text" required value={formData.aadhar} onChange={e => setFormData({...formData, aadhar: e.target.value})} className="mt-1 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-400">Date of Birth *</label><input type="date" required value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="mt-1 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-400">PAN Number *</label><input type="text" required value={formData.pan} onChange={e => setFormData({...formData, pan: e.target.value})} className="mt-1 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-400">Email *</label><input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-400">Driving License Number *</label><input type="text" required value={formData.drivingLicense} onChange={e => setFormData({...formData, drivingLicense: e.target.value})} className="mt-1 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-400">Years of Experience *</label><input type="number" required value={formData.yearsOfExperience} onChange={e => setFormData({...formData, yearsOfExperience: e.target.value})} className="mt-1 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-400">Highest Qualification *</label><input type="text" required value={formData.highestQualification} onChange={e => setFormData({...formData, highestQualification: e.target.value})} className="mt-1 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 outline-none" /></div>
                  </div>
                </div>

                {/* Document Uploads - Card style */}
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    
                    Document Uploads
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DocumentUploadCard title="Profile Photo" description="Upload driver photo" field="profilePhoto" />
                    <DocumentUploadCard title="Aadhar Card (Front)" description="Clear photo of front side" field="aadharFront" />
                    <DocumentUploadCard title="Aadhar Card (Back)" description="Clear photo of back side" field="aadharBack" />
                    <DocumentUploadCard title="PAN Card" description="Upload PAN image" field="panImage" />
                    <DocumentUploadCard title="Driving License" description="Upload license image" field="licenseImage" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={closeModal} className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all duration-200">
                    {editingDriver ? 'Update Driver' : 'Create Driver'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}