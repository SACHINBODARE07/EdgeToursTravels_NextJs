import React from 'react';

export default function CTA() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-[#00adef] rounded-[2rem] p-16 text-center relative overflow-hidden flex flex-col items-center shadow-xl shadow-blue-500/10">


        <h2 className="text-4xl font-bold text-white mb-8 relative z-10">
          Ready for your next <br /> Masterpiece Travel?
        </h2>
        <div className="flex space-x-4 relative z-10">
          <button className="bg-[#FFB800] text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition shadow-lg">
            Become a Member
          </button>
          <button className="bg-transparent border border-white/30 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition">
            View Fleet Gallery
          </button>
        </div>
      </div>
    </section>
  );
}