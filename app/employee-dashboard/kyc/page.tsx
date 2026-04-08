'use client';

import React from 'react';
import { HiOutlineCloudUpload } from 'react-icons/hi';

export default function KycPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <span className="w-1.5 h-8 bg-orange-500 rounded-full"></span>
          KYC Verification
        </h2>
        <p className="text-slate-500 mb-8">Please upload the required documents to verify your identity.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center group hover:border-orange-200 transition-colors">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <HiOutlineCloudUpload className="text-3xl text-slate-400 group-hover:text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Aadhar Card</h3>
            <p className="text-sm text-slate-500 mb-4">Upload a clear photo of your Aadhar card (Front & Back)</p>
            <button className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors">
              Browse Files
            </button>
          </div>
          
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center group hover:border-orange-200 transition-colors">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <HiOutlineCloudUpload className="text-3xl text-slate-400 group-hover:text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Driving License</h3>
            <p className="text-sm text-slate-500 mb-4">Required for driver registration and verification</p>
            <button className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors">
              Browse Files
            </button>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-lg">
          <p className="text-sm text-orange-700 font-medium">
            <span className="font-bold">Note:</span> Max file size 5MB. Supported formats: JPG, PNG, PDF.
          </p>
        </div>
      </div>
    </div>
  );
}
