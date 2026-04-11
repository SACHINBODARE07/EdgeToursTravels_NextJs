'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser, clearAuthData } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';
import { HiOutlineUser, HiOutlineCog6Tooth, HiOutlinePencilSquare, HiOutlineLockClosed, HiOutlineSun, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (!user || user.role !== 'admin') {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuthData();
    router.push('/login');
  };

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-vh-100 bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">
            Admin Panel
          </h1>

          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-all"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-sm text-slate-500">Welcome, Administrator</span>
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold shadow-md shadow-orange-200 ring-2 ring-white">
                A
              </div>
            </div>

            {/* Professional Profile Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <HiOutlineUser className="text-lg text-slate-400" />
                  <span className="font-medium">About</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <HiOutlineCog6Tooth className="text-lg text-slate-400" />
                  <span className="font-medium">Settings</span>
                </button>
                {/* <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <HiOutlinePencilSquare className="text-lg text-slate-400" />
                  <span className="font-medium">Edit Menu</span>
                </button> */}
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <HiOutlineLockClosed className="text-lg text-slate-400" />
                  <span className="font-medium">Change Password</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <HiOutlineSun className="text-lg text-slate-400" />
                  <span className="font-medium">Dark Mode</span>
                </button>
                <div className="h-px bg-slate-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <HiOutlineArrowRightOnRectangle className="text-lg" />
                  <span className="font-bold uppercase tracking-wider text-[11px]">Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
