// app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getAuthToken } from '@/lib/auth';

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ email: '', mobileNumber: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const token = getAuthToken();
    const res = await fetch('/api/admin/employees', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setEmployees(data.employees);
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const token = getAuthToken();
    const res = await fetch('/api/admin/create-employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newEmployee),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Employee created! Temporary password: ${data.temporaryPassword}`);
      setNewEmployee({ email: '', mobileNumber: '', name: '' });
      fetchEmployees();
    } else {
      setMessage(`Error: ${data.error}`);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-orange-200 transition-colors group">
          <p className="text-slate-500 text-sm font-medium">Total Employees</p>
          <div className="flex justify-between items-end mt-2">
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{employees.length}</h3>
            <span className="text-xs text-green-500 font-semibold bg-green-50 px-2 py-1 rounded-md">+2 this month</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-orange-200 transition-colors group">
          <p className="text-slate-500 text-sm font-medium">Active Drivers</p>
          <div className="flex justify-between items-end mt-2">
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">24</h3>
            <span className="text-xs text-orange-400 font-semibold bg-orange-50 px-2 py-1 rounded-md">8 on duty</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-orange-200 transition-colors group">
          <p className="text-slate-500 text-sm font-medium">Pending Reviews</p>
          <div className="flex justify-between items-end mt-2">
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">12</h3>
            <span className="text-xs text-red-500 font-semibold bg-red-50 px-2 py-1 rounded-md">Action required</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-orange-200 transition-colors group">
          <p className="text-slate-500 text-sm font-medium">System Status</p>
          <div className="flex items-center gap-2 mt-2">
            <h3 className="text-3xl font-bold text-green-500 tracking-tight flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </h3>
          </div>
        </div>
      </div>

    </div>
  );
}