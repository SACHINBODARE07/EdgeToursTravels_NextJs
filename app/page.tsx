"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Offers from "./components/Offers";
import Reliability from "./components/Reliability";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen font-outfit">
      <Navbar />
      <Hero />
      <div className="relative z-20 bg-white">
        <Offers />
        <Reliability />
        <CTA />
        <Footer />
      </div>

      {/* Decorative Blur and Patterns */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-secondary/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[150px]" />
      </div>
    </main>
  );
}