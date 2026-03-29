"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GooeyText } from "@/components/ui/gooey-text-morphing";

export default function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  const scrollToGrid = () => {
    document.getElementById("brand-grid")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] flex flex-col overflow-hidden border-b border-zinc-800/40">

      {/* Film grain */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.18] z-0" aria-hidden="true">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)] pointer-events-none z-0" />

      {/* Atmospheric glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.06),transparent)] pointer-events-none z-0" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-10" />

      {/* Top label bar */}
      <div className="relative z-20 w-full border-b border-zinc-800/40 px-6 md:px-12 py-4 flex items-center justify-between">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-[10px] font-medium tracking-[0.4em] uppercase text-zinc-600"
        >
          S/S 2025
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-[10px] font-medium tracking-[0.4em] uppercase text-zinc-600"
        >
          Brand Discovery Platform
        </motion.span>
      </div>

      {/* Main content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="h-px w-10 bg-zinc-700" />
          <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-zinc-500">
            The Edit
          </span>
          <div className="h-px w-10 bg-zinc-700" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[clamp(48px,9vw,112px)] font-light text-white leading-[0.95] tracking-tight mb-1"
        >
          The brands that
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <GooeyText
            texts={["define culture.", "inspire style.", "shape identity.", "set the standard.", "move the market.", "find your style."]}
            morphTime={1}
            cooldownTime={1.5}
            className="w-full"
            textClassName="text-[clamp(48px,9vw,112px)] font-light text-zinc-500 tracking-tight leading-[0.95]"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="text-zinc-600 text-[11px] tracking-[0.25em] uppercase mt-10 mb-10"
        >
          Streetwear · Luxury · Avant-Garde · 300+ Brands
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.05 }}
          className="flex items-center gap-8"
        >
          <button
            onClick={scrollToGrid}
            className="group flex items-center gap-3 text-white text-[11px] tracking-[0.25em] uppercase font-medium hover:text-zinc-400 transition-colors duration-300"
          >
            <span className="w-6 h-px bg-white group-hover:w-10 transition-all duration-300" />
            Explore
          </button>
          {!isLoggedIn && (
            <>
              <span className="text-zinc-800 text-xs">·</span>
              <Link
                href="/signup"
                className="text-zinc-600 text-[11px] tracking-[0.25em] uppercase font-medium hover:text-white transition-colors duration-300"
              >
                Join
              </Link>
            </>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-20 pb-10 flex flex-col items-center gap-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-col items-center gap-2 cursor-pointer group"
          onClick={scrollToGrid}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase text-zinc-700 group-hover:text-zinc-500 transition-colors">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-7 bg-gradient-to-b from-zinc-600 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
