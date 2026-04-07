import React from 'react';

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-center mb-12">
        <h4 className="text-xs font-bold text-[#FFB800] uppercase tracking-widest mb-2">The Edge Standard</h4>
        <h2 className="text-4xl font-extrabold text-[#0A1128]">Redefining Reliability</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-[2rem] p-8 flex flex-col justify-between shadow-xl shadow-gray-200/50">
          <div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-[#0A1128]">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-[#0A1128] mb-4">Unmatched Precision</h3>
            <p className="text-gray-500 leading-relaxed">
              Our logistics engine tracks every Cabs and traffic pattern in real-time. Whether it's a 3 AM arrival or a last-minute schedule shift, your Voyager concierge is already two steps ahead.
            </p>
          </div>
          <div className="mt-12 flex items-center space-x-4 border-t border-gray-100 pt-6">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white"></div>
            </div>
            <p className="text-xs text-gray-500 font-medium">Joined by 10,000+ Frequent Travelers</p>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#0A1128] rounded-[2rem] p-8 text-white relative overflow-hidden flex items-center">
            <div className="relative z-10 w-2/3">
              <h3 className="text-2xl font-bold mb-3">Elite Fleet Options</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                From zero-emission premium sedans to rough-terrain Scorpio-N and Innova, our inventory is the widest in the industry.
              </p>
            </div>
            <div className="absolute right-0 top-0 w-64 h-full bg-blue-900/30 rounded-l-full blur-2xl"></div>
            <div className="absolute right-10 z-10 opacity-50">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l3 5v6H3V7h5m14 0v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2m14 0h-4v5h4V7zM5 18a2 2 0 100-4 2 2 0 000 4zm14 0a2 2 0 100-4 2 2 0 000 4z" /></svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 h-full">
            <div className="bg-[#FFB800] rounded-[2rem] p-6 flex flex-col items-center justify-center text-center text-[#0A1128]">
              <div className="mb-4 bg-white/20 p-3 rounded-full">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-1">Human Only</h3>
              <p className="text-xs text-[#0A1128]/80 font-medium">24/7 dedicated personal agents.</p>
            </div>

            <div className="bg-[#EAECEF] rounded-[2rem] p-6 flex flex-col items-center justify-center text-center">
              <div className="mb-4 bg-white p-3 rounded-full text-[#0A1128] shadow-sm">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              </div>
              <h3 className="font-bold text-[#0A1128] text-lg mb-1">120+ Cities</h3>
              <p className="text-xs text-gray-500 font-medium">Localized expertise everywhere.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}