'use client';

import Link from 'next/link';

export default function MasterDataPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 uppercase tracking-tight">Master Data Management</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium italic">These modules have been moved to dedicated management sections for a better professional experience.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Drivers', path: '/admin-dashboard/drivers', desc: 'Secure profile management and KYC' },
            { title: 'Vehicles', path: '/admin-dashboard/vehicles', desc: 'Detailed fleet registration and tracking' },
            { title: 'Employees', path: '/admin-dashboard/employees', desc: 'Administrative staff and access control' },
            { title: 'Documents', path: '/admin-dashboard/master-data/documents', desc: 'Manage dynamic document upload requirements' }
          ].map((item) => (
            <Link 
              key={item.title} 
              href={item.path}
              className="group p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-md active:scale-95"
            >
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight md:text-sm lg:text-lg">{item.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}