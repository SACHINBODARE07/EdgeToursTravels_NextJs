'use client';

import React from 'react';
import { HiOutlineLockClosed, HiOutlineBell, HiOutlineDeviceMobile } from 'react-icons/hi';

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-8 bg-orange-500 rounded-full"></span>
          Account Settings
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <HiOutlineLockClosed className="text-2xl text-slate-400 group-hover:text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Change Password</h3>
                <p className="text-sm text-slate-500">Update your account password regularly</p>
              </div>
            </div>
            <button className="text-orange-500 font-bold text-sm">Update</button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <HiOutlineBell className="text-2xl text-slate-400 group-hover:text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Notification Preferences</h3>
                <p className="text-sm text-slate-500">Manage how you receive alerts and updates</p>
              </div>
            </div>
            <button className="text-orange-500 font-bold text-sm">Configure</button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <HiOutlineDeviceMobile className="text-2xl text-slate-400 group-hover:text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Two-Factor Authentication</h3>
                <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
              </div>
            </div>
            <button className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-sm font-bold">Enable</button>
          </div>
        </div>
      </div>
    </div>
  );
}
