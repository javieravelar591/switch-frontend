"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  const scrollToGrid = () => {
    document.getElementById("brand-grid")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="w-full border-b border-zinc-800/60">
      <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 flex flex-col items-start gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-4 block">
            Brand Discovery
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight max-w-2xl">
            The brands that{" "}
            <span className="text-zinc-400">define culture.</span>
          </h1>
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
          {[
            { label: "Brands", value: "300+" },
            { label: "Categories", value: "Streetwear & Luxury" },
            { label: "Personalised for you", value: "AI Recs" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-0.5">
              <span className="text-white font-semibold text-sm">{stat.value}</span>
              <span className="text-zinc-600 text-xs">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
