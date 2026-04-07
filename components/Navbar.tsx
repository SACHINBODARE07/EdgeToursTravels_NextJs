import React from 'react';

export default function Navbar() {
  return (
    <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-10 py-6 text-white bg-gradient-to-b from-black/60 to-transparent">
      <div className="text-2xl font-bold tracking-wider">Edge tour and travels</div>
      <div className="hidden md:flex space-x-8 text-sm font-medium">
        <a href="#" className="border-b-2 border-white pb-1">Hatchback (Mini/Economy)</a>
        <a href="#" className="text-gray-200 hover:text-white transition">Sedan(Prime/Comfort)</a>
        <a href="#" className="text-gray-200 hover:text-white transition">SUV/MUV(XL/6-Seater)</a>
        <a href="#" className="text-gray-200 hover:text-white transition">Luxury(Premium/Black)</a>
        <a href="#" className="text-gray-200 hover:text-white transition">Compact SUV</a>
      </div>
      <div className="flex items-center space-x-6 text-sm">
        <a href="#" className="hover:text-gray-200">Support</a>
        <button className="bg-[#0A1128] text-white px-6 py-2 rounded-full font-medium hover:bg-blue-900 transition">
          Sign In
        </button>
      </div>
    </nav>
  );
}