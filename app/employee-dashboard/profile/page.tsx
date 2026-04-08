'use client';

import React from 'react';
import { getStoredUser } from '@/lib/auth';

export default function ProfilePage() {
  const user = getStoredUser();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-8 bg-orange-500 rounded-full"></span>
          My Profile
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-400 border-2 border-slate-200 uppercase">
            {user?.name?.charAt(0) || 'U'}
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <p className="text-lg font-semibold text-slate-800">{user?.name || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                <p className="text-lg font-semibold text-slate-800">{user?.email || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Mobile Number</label>
                <p className="text-lg font-semibold text-slate-800">{user?.mobileNumber || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Role</label>
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-100 uppercase">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
