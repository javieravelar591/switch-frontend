"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import { SlidingNumber } from "@/components/ui/sliding-number";
import { useEffect, useState } from "react";

export default function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [brandCount, setBrandCount] = useState(0);

  useEffect(() => {
    const target = 300;
    const duration = 1800;
    const steps = 60;
    const increment = Math.ceil(target / steps);
    const intervalMs = duration / steps;
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + increment, target);
      setBrandCount(current);
      if (current >= target) clearInterval(interval);
    }, intervalMs);
    return () => clearInterval(interval);
  }, []);

  const scrollToGrid = () => {
    document.getElementById("brand-grid")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="w-full border-b border-zinc-800/60 relative overflow-hidden">
      {/* Grid background pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      {/* Indigo radial glow */}
      <div className="absolute -top-32 left-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 flex flex-col items-start gap-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-4 block">
            Brand Discovery
          </span>
          <div className="flex flex-col max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight">
              The brands that
            </h1>
            <GooeyText
              texts={["define culture.", "inspire style.", "shape identity.", "set the standard.", "move the market."]}
              morphTime={1}
              cooldownTime={0.25}
              className="w-full"
              textClassName="text-5xl md:text-7xl font-bold text-zinc-400 tracking-tight leading-[1.05]"
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="text-zinc-400 text-lg md:text-xl max-w-xl leading-relaxed"
        >
          Explore 300+ streetwear and luxury brands. Favorite the ones you love —
          we'll surface more like them.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex items-center gap-3 pt-2"
        >
          <button
            onClick={scrollToGrid}
            className="bg-white text-black px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors"
          >
            Explore Brands
          </button>
          {!isLoggedIn && (
            <Link
              href="/signup"
              className="text-zinc-400 text-sm font-medium hover:text-white transition-colors px-2 py-2.5"
            >
              Create account →
            </Link>
          )}
        </motion.div>

        {/* Stat row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center gap-8 pt-4 border-t border-zinc-800 w-full"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-white font-semibold text-sm flex items-center">
              <SlidingNumber value={brandCount} />
              <span>+</span>
            </span>
            <span className="text-zinc-600 text-xs">Brands</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-white font-semibold text-sm">Streetwear & Luxury</span>
            <span className="text-zinc-600 text-xs">Categories</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-white font-semibold text-sm">AI Recs</span>
            <span className="text-zinc-600 text-xs">Personalised for you</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
