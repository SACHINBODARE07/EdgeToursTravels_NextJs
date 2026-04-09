'use client';

import React, { useState } from 'react';
import { HiMapPin, HiCalendarDays, HiUsers, HiMagnifyingGlass } from 'react-icons/hi2';

const TABS = [
    { id: 'cabs', label: 'CABS' },
    { id: 'luxury-cabs', label: 'LUXURY CABS' },
    { id: 'suvs', label: 'SUVS' },
    { id: 'packages', label: 'PACKAGES' }
];

export default function SearchForm() {
    const [activeTab, setActiveTab] = useState('cabs');

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            <div className="relative group">
                {/* Advanced Background Glows */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#EB664E]/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="bg-[#0A1128]/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-3 md:p-6 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
                    {/* Floating Tab Navigation */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-8 px-4">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden ${activeTab === tab.id
                                        ? 'text-white'
                                        : 'text-white/40 hover:text-white/70'
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <div className="absolute inset-0 bg-[#EB664E] shadow-[0_0_25px_rgba(235,102,78,0.4)] transition-all duration-500"></div>
                                )}
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Integrated Form Container with conditional rendering based on activeTab */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 p-2 lg:p-4 transition-all duration-500">
                        
                        {/* Field 1: Locations (Changes based on tab) */}
                        <div className="lg:col-span-3">
                            <div className="relative h-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-5 transition-all duration-500 group/field cursor-pointer focus-within:border-[#EB664E]/50 focus-within:ring-4 focus-within:ring-[#EB664E]/5">
                                <p className="flex items-center gap-2 text-[10px] text-white/50 font-black uppercase tracking-[0.25em] mb-3">
                                    <HiMapPin className="text-[#EB664E] text-base" />
                                    {activeTab === 'packages' ? 'Starting From' : 'Pick-up'}
                                </p>
                                <input
                                    type="text"
                                    placeholder={activeTab === 'packages' ? 'Select City' : 'City or Airport'}
                                    className="w-full bg-transparent outline-none text-base font-bold text-white placeholder:text-white/20"
                                />
                                <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[#EB664E]/30 to-transparent opacity-0 group-focus-within/field:opacity-100 transition-opacity"></div>
                            </div>
                        </div>

                        {/* Field 2: Destination/Package (Changes based on tab) */}
                        <div className="lg:col-span-3">
                            <div className="relative h-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-5 transition-all duration-500 group/field cursor-pointer focus-within:border-[#EB664E]/50 focus-within:ring-4 focus-within:ring-[#EB664E]/5">
                                <p className="flex items-center gap-2 text-[10px] text-white/50 font-black uppercase tracking-[0.25em] mb-3">
                                    <HiMapPin className="text-blue-500 text-base" />
                                    {activeTab === 'packages' ? 'Package Type' : 'Drop-off'}
                                </p>
                                {activeTab === 'packages' ? (
                                    <select className="w-full bg-transparent outline-none text-base font-bold text-white appearance-none cursor-pointer">
                                        <option className="bg-[#0A1128]">Himalayan Tour</option>
                                        <option className="bg-[#0A1128]">Coastal Getaway</option>
                                        <option className="bg-[#0A1128]">City Heritage</option>
                                        <option className="bg-[#0A1128]">Custom Adventure</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="Destination"
                                        className="w-full bg-transparent outline-none text-base font-bold text-white placeholder:text-white/20"
                                    />
                                )}
                                <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-focus-within/field:opacity-100 transition-opacity"></div>
                            </div>
                        </div>

                        {/* Field 3: Date (Changes based on tab) */}
                        <div className="lg:col-span-2">
                            <div className="relative h-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-5 transition-all duration-500 group/field cursor-pointer focus-within:border-[#EB664E]/50 focus-within:ring-4 focus-within:ring-[#EB664E]/5">
                                <p className="flex items-center gap-2 text-[10px] text-white/50 font-black uppercase tracking-[0.25em] mb-3">
                                    <HiCalendarDays className="text-[#EB664E] text-base" />
                                    {activeTab === 'packages' ? 'Travel Date' : 'When'}
                                </p>
                                <input
                                    type="text"
                                    placeholder="Select Date"
                                    className="w-full bg-transparent outline-none text-base font-bold text-white placeholder:text-white/20"
                                />
                            </div>
                        </div>

                        {/* Field 4: Selection (Changes based on tab) */}
                        <div className="lg:col-span-2">
                            <div className="relative h-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-5 transition-all duration-500 group/field cursor-pointer focus-within:border-[#EB664E]/50 focus-within:ring-4 focus-within:ring-[#EB664E]/5">
                                <p className="flex items-center gap-2 text-[10px] text-white/50 font-black uppercase tracking-[0.25em] mb-3">
                                    <HiUsers className="text-[#EB664E] text-base" />
                                    {activeTab === 'luxury-cabs' ? 'Service' : 'Travelers'}
                                </p>
                                <select className="w-full bg-transparent outline-none text-base font-bold text-white appearance-none cursor-pointer">
                                    {activeTab === 'luxury-cabs' ? (
                                        <>
                                            <option className="bg-[#0A1128]">Premium Chauffeur</option>
                                            <option className="bg-[#0A1128]">VIP Airport Transfer</option>
                                            <option className="bg-[#0A1128]">Wedding Special</option>
                                        </>
                                    ) : (
                                        <>
                                            <option className="bg-[#0A1128]">1 Person</option>
                                            <option className="bg-[#0A1128]">2 People</option>
                                            <option className="bg-[#0A1128]">Family (4+)</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* Professional Search Button */}
                        <div className="lg:col-span-2">
                            <button className="relative w-full h-full min-h-[70px] bg-[#EB664E] rounded-3xl flex flex-col items-center justify-center gap-1 group/btn shadow-[0_20px_40px_-10px_rgba(235,102,78,0.5)] active:scale-95 transition-all duration-300 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                
                                <HiMagnifyingGlass className="text-white text-2xl group-hover:scale-110 transition-transform" />
                                <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                    {activeTab === 'packages' ? 'Explore' : 'Search'}
                                </span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
