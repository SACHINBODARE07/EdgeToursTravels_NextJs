'use client';

import { useEffect, useState } from 'react';
import { getAuthToken } from '@/lib/auth';
import { HiSearch, HiPlus, HiOutlineEye } from 'react-icons/hi';

function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDriver, setIsDriver] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    email: '',
    mobileNumber: '',
    name: '',
    // Driver-specific fields
    fullName: '',
    dateOfBirth: '',
    drivingLicenseNumber: '',
    dlExpiryDate: '',
    vehicleRegNumber: '',
    vehicleType: 'car',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatName = (name: string) => {
    return name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const fetchEmployees = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch('/api/admin/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.employees && data.employees.length > 0) {
        const enhancedEmployees = data.employees.map((emp: any) => ({
          ...emp,
          username: emp.username || emp.name?.toLowerCase().replace(/\s+/g, ''),
          role: emp.role || 'Employee',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`,
          status: 'Active',
        }));
        setEmployees(enhancedEmployees);
      } else if (res.ok) {
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = getAuthToken();
    let payload: any = {
      email: newEmployee.email,
      mobileNumber: newEmployee.mobileNumber,
      name: newEmployee.name,
    };

    if (isDriver) {
      payload.role = 'driver';
      payload.driverDetails = {
        fullName: newEmployee.fullName,
        dateOfBirth: newEmployee.dateOfBirth,
        drivingLicenseNumber: newEmployee.drivingLicenseNumber,
        dlExpiryDate: newEmployee.dlExpiryDate,
        vehicleRegNumber: newEmployee.vehicleRegNumber,
        vehicleType: newEmployee.vehicleType,
        vehicleMake: newEmployee.vehicleMake,
        vehicleModel: newEmployee.vehicleModel,
        vehicleYear: newEmployee.vehicleYear ? parseInt(newEmployee.vehicleYear as any) : undefined,
        accountHolderName: newEmployee.accountHolderName,
        bankName: newEmployee.bankName,
        accountNumber: newEmployee.accountNumber,
        ifscCode: newEmployee.ifscCode,
      };
    } else {
      payload.role = 'employee';
    }

    try {
      const res = await fetch('/api/admin/create-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Success! Temporary password: ${data.temporaryPassword}`);
        setNewEmployee({
          email: '',
          mobileNumber: '',
          name: '',
          fullName: '',
          dateOfBirth: '',
          drivingLicenseNumber: '',
          dlExpiryDate: '',
          vehicleRegNumber: '',
          vehicleType: 'car',
          vehicleMake: '',
          vehicleModel: '',
          vehicleYear: '',
          accountHolderName: '',
          bankName: '',
          accountNumber: '',
          ifscCode: '',
        });
        setIsDriver(false);
        fetchEmployees();
        setTimeout(() => {
          setIsModalOpen(false);
          setMessage('');
        }, 3000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="-mt-8 -mx-8 animate-in fade-in duration-500">
      <div className="bg-white border-b border-slate-200 overflow-hidden">
        {/* Header Toolbar */}
        <div className="bg-[#f8f9fa] py-2 px-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Users <span className="text-slate-400 font-normal">({employees.length})</span>
          </h2>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#48bb78] hover:bg-[#38a169] text-white px-4 py-2 rounded-md font-bold text-sm transition-colors whitespace-nowrap shadow-sm"
            >
              <HiPlus className="w-5 h-5" /> Add User
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200">
                <th className="px-6 py-2 text-left text-[13px] font-bold text-slate-700 border-r border-slate-200">Name</th>
                <th className="px-6 py-2 text-left text-[13px] font-bold text-slate-700 border-r border-slate-200">Username</th>
                <th className="px-6 py-2 text-left text-[13px] font-bold text-slate-700 border-r border-slate-200">Email</th>
                <th className="px-6 py-2 text-left text-[13px] font-bold text-slate-700 border-r border-slate-200">Role</th>
                <th className="px-6 py-2 text-left text-[13px] font-bold text-slate-700 border-r border-slate-200">Status</th>
                <th className="px-6 py-2 text-left text-[13px] font-bold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp: any) => (
                <tr key={emp._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-1.5 text-sm font-medium text-slate-800 border-r border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 text-green-700 font-bold text-xs ring-1 ring-green-200 flex-shrink-0">
                        {getInitials(emp.name)}
                      </div>
                      <span className="truncate">{formatName(emp.name)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-1.5 text-sm text-slate-600 border-r border-slate-200">{emp.username}</td>
                  <td className="px-6 py-1.5 text-sm text-slate-600 border-r border-slate-200">{emp.email}</td>
                  <td className="px-6 py-1.5 text-sm text-slate-600 font-medium border-r border-slate-200">{emp.role}</td>
                  <td className="px-6 py-1.5 text-sm border-r border-slate-200">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${emp.status === 'Active' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                      {emp.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-1.5 text-sm text-center">
                    <button className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all duration-200" title="View Details">
                      <HiOutlineEye className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400 bg-white">
                    <p className="text-lg">No users found</p>
                    <p className="text-sm">Try adjusting your search filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal with Driver Fields */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#1e293b] flex items-center gap-3 mb-6">
                <span className="w-1.5 h-8 bg-orange-500 rounded-full"></span>
                Create New Employee
              </h2>

              <form onSubmit={handleCreateEmployee} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number *</label>
                    <input
                      type="tel"
                      placeholder="10 digit number"
                      required
                      value={newEmployee.mobileNumber}
                      onChange={(e) => setNewEmployee({ ...newEmployee, mobileNumber: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                {/* Driver Toggle */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="isDriver"
                    checked={isDriver}
                    onChange={(e) => setIsDriver(e.target.checked)}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-slate-300 rounded"
                  />
                  <label htmlFor="isDriver" className="text-sm font-semibold text-slate-700">
                    This user is a driver (add driver details)
                  </label>
                </div>

                {/* Driver-specific fields (conditionally shown) */}
                {isDriver && (
                  <div className="space-y-6 border-t pt-4">
                    <h3 className="text-lg font-semibold text-slate-800">Driver Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Full Name (as per DL) *</label>
                        <input type="text" required value={newEmployee.fullName} onChange={e => setNewEmployee({ ...newEmployee, fullName: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Date of Birth *</label>
                        <input type="date" required value={newEmployee.dateOfBirth} onChange={e => setNewEmployee({ ...newEmployee, dateOfBirth: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Driving License Number *</label>
                        <input type="text" required value={newEmployee.drivingLicenseNumber} onChange={e => setNewEmployee({ ...newEmployee, drivingLicenseNumber: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">DL Expiry Date *</label>
                        <input type="date" required value={newEmployee.dlExpiryDate} onChange={e => setNewEmployee({ ...newEmployee, dlExpiryDate: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Vehicle Registration Number *</label>
                        <input type="text" required value={newEmployee.vehicleRegNumber} onChange={e => setNewEmployee({ ...newEmployee, vehicleRegNumber: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Vehicle Type *</label>
                        <select value={newEmployee.vehicleType} onChange={e => setNewEmployee({ ...newEmployee, vehicleType: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2">
                          <option value="auto">Auto</option>
                          <option value="bike">Bike</option>
                          <option value="car">Car</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Vehicle Make</label>
                        <input type="text" value={newEmployee.vehicleMake} onChange={e => setNewEmployee({ ...newEmployee, vehicleMake: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Vehicle Model</label>
                        <input type="text" value={newEmployee.vehicleModel} onChange={e => setNewEmployee({ ...newEmployee, vehicleModel: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Year of Manufacture</label>
                        <input type="number" value={newEmployee.vehicleYear} onChange={e => setNewEmployee({ ...newEmployee, vehicleYear: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-800 mt-4">Bank Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Account Holder Name *</label>
                        <input type="text" required value={newEmployee.accountHolderName} onChange={e => setNewEmployee({ ...newEmployee, accountHolderName: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Bank Name *</label>
                        <input type="text" required value={newEmployee.bankName} onChange={e => setNewEmployee({ ...newEmployee, bankName: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Account Number *</label>
                        <input type="text" required value={newEmployee.accountNumber} onChange={e => setNewEmployee({ ...newEmployee, accountNumber: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">IFSC Code *</label>
                        <input type="text" required value={newEmployee.ifscCode} onChange={e => setNewEmployee({ ...newEmployee, ifscCode: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
                      </div>
                    </div>
                  </div>
                )}

                {message && (
                  <div className={`p-4 rounded-lg text-sm font-medium ${message.startsWith('Error') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                    {message}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-[#0f172a] text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-lg shadow-slate-200"
                  >
                    {loading ? 'Creating...' : 'Create Employee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeesPage;