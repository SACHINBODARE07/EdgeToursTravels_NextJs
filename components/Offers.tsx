import React from 'react';

export default function Offers() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 relative z-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Executive Transport</h4>
          <h2 className="text-3xl font-bold text-[#0A1128]">Government & VIP Fleets</h2>
        </div>
        <a href="#" className="text-sm font-semibold text-gray-600 hover:text-black flex items-center">
          View All Vehicles <span className="ml-2">→</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative h-96 rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
          <img src="https://static3.toyotabharat.com/images/showroom/innova-hycross/comfort-img1.webp" alt="Innova Hycross" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute top-4 left-4 bg-[#FFB800] text-black text-xs font-bold px-3 py-1 rounded-full">MINISTRY SPECIAL</div>
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-white">
            <div>
              <p className="text-xs font-medium mb-1">Monthly Retainer</p>
              <h3 className="text-xl font-bold">Delhi NCR Executive Fleet</h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase opacity-80">Starting</p>
              <p className="font-bold text-lg">Rs 45,000/mo</p>
            </div>
          </div>
        </div>

        <div className="relative h-96 rounded-3xl overflow-hidden group cursor-pointer shadow-lg bg-white border border-gray-100">
          <div className="h-1/2 relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=2070&auto=format&fit=crop" alt="Indian Premium Sedan Exterior" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute top-4 left-4 bg-[#0A1128] text-white text-xs font-bold px-3 py-1 rounded-full">EDGE FLEET</div>
          </div>
          <div className="p-6 flex flex-col justify-between h-1/2">
            <div>
              <h3 className="text-xl font-bold text-[#0A1128] mb-2">Inter-State VIP Transfers</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Book 10 inter-city transfers between Lucknow and Delhi, and receive Rs 2500 credit toward your next ride.</p>
            </div>
            <div className="flex justify-between items-end">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Wallet Credit</p>
              <p className="font-bold text-xl text-[#0A1128]">Rs 2500</p>
            </div>
          </div>
        </div>

        <div className="relative h-96 rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
          <img src="https://www.mercedes-benz.co.in/content/dam/hq/passengercars/cars/s-class/s-class-saloon-long-v223-pi/overview/spa-highlight/02-2025/images/mercedes-benz-s-class-v223-spa-rear-compartment-2400x2400-02-2025.jpg?im=Resize,width=1014" alt="Luxury Prime Sedan Interior Rear Seat" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-xs font-medium mb-1 text-gray-300">Comfort Priority</p>
            <h3 className="text-xl font-bold text-white mb-3">Prime Sedan Upgrades</h3>
            <div className="flex justify-between items-end text-white border-t border-white/20 pt-3">
              <p className="text-xs text-gray-300 w-2/3 leading-snug">Experience unmatched legroom and verified air-conditioned comfort on all inter-city Prime Sedan bookings.</p>
              <div className="text-right">
                <p className="text-[10px] uppercase opacity-80 text-gray-300">Status</p>
                <p className="font-bold text-white">Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}