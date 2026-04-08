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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Employee Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-800">
            <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
            Create New Employee
          </h2>
          <form onSubmit={handleCreateEmployee} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                required
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                placeholder="10 digit number"
                required
                value={newEmployee.mobileNumber}
                onChange={(e) => setNewEmployee({ ...newEmployee, mobileNumber: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-slate-900 text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Employee'}
            </button>
          </form>
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {message}
            </div>
          )}
        </div>

        {/* Stats Summary - Placeholder for professional look */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium">Total Employees</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{employees.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium">Active Drivers</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">24</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium">Pending Reviews</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">12</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium">System Status</p>
            <h3 className="text-3xl font-bold text-green-500 mt-1 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-800">Employee List</h2>
          <span className="text-sm text-slate-500">{employees.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Mobile</th>
                <th className="p-4 text-right text-sm font-semibold text-slate-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">No employees found.</td>
                </tr>
              ) : (
                employees.map((emp: any) => (
                  <tr key={emp._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{emp.name || '-'}</td>
                    <td className="p-4 text-slate-600">{emp.email}</td>
                    <td className="p-4 text-slate-600">{emp.mobileNumber}</td>
                    <td className="p-4 text-right">
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}