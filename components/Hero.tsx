'use client';

import React, { useState, useEffect } from 'react';

const images = [
  '/images/hero_bg.png',
  '/images/car2_bg.png',
  '/images/car3_bg.png'
];

import SearchForm from './SearchForm';

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative h-screen min-h-[750px] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0 bg-black">
        {images.map((img, index) => {
          const isActive = index === currentIndex;
          // Determine if it should be off-screen right or off-screen left
          // If it's active, it's at 0.
          // If it's the previous one, it should be at -100% (sliding out left)
          // Otherwise, it stays at 100% (waiting to slide in from right)
          
          return (
            <div
              key={img}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-[2500ms] cubic-bezier(0.4, 0, 0.2, 1)`}
              style={{
                backgroundImage: `url('${img}')`,
                transform: isActive 
                  ? 'translateX(0) scale(1.05)' 
                  : (index < currentIndex || (currentIndex === 0 && index === images.length - 1)) 
                    ? 'translateX(-100%) scale(1.1)' 
                    : 'translateX(100%) scale(1.1)',
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 10 : 0,
                filter: isActive ? 'brightness(1.1) contrast(1.05) saturate(1.1)' : 'brightness(0.9)'
              }}
            >
              {/* Light-weight overlay to keep the focus on highlights */}
              <div className="absolute inset-0 bg-white/5"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10"></div>
              {/* Subtle top light highlight */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_70%)]"></div>
            </div>


          );
        })}
      </div>


      <div className="relative z-10 max-w-7xl w-full flex flex-col items-center gap-12 pt-20">
        {/* <div className="space-y-6">
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter drop-shadow-2xl uppercase leading-none">
            Elite <span className="text-[#EB664E]">Travel</span> <br />
            <span className="text-white/80">Experience</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 font-medium max-w-2xl mx-auto drop-shadow-lg leading-relaxed">
            Unparalleled luxury transportation and bespoke world-class travel packages <br className="hidden md:block" /> tailored for those who demand excellence.
          </p>
        </div> */}

        <SearchForm />
      </div>


      {/* Navigation Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 rounded-full transition-all duration-500 ${index === currentIndex ? 'bg-[#EB664E] w-12' : 'bg-white/30 hover:bg-white/60 w-6'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </header>
  );
}

export default Hero;