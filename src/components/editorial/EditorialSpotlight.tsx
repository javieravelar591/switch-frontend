"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { resolveLogoUrl } from "@/lib/logoUrl";

type Brand = {
  id: number;
  name: string;
  logo_url?: string;
  category?: string;
  description?: string;
  region?: string;
  country?: string;
};

export default function EditorialSpotlight() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands?limit=10&sort=newest`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Brand[]) => setBrands(data.filter((b) => b.description).slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <EditorialSkeleton />;
  if (brands.length === 0) return null;

  const now = new Date();
  const dateLabel = now
    .toLocaleDateString("en-US", { month: "long", year: "numeric" })
    .toUpperCase();

  const [featured, ...rest] = brands;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 pb-2 pt-8">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-5">
        <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-zinc-600">
          Editorial
        </span>
        <div className="flex-1 h-px bg-zinc-800/80" />
        <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-700">
          {dateLabel}
        </span>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Featured card — left, spans 3 cols */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-3"
        >
          <Link
            href={`/brands/${featured.id}`}
            className="relative block h-full min-h-[300px] md:min-h-[380px] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/50 group cursor-pointer"
          >
            {/* Atmospheric watermark logo */}
            {resolveLogoUrl(featured.logo_url) && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img
                  src={resolveLogoUrl(featured.logo_url)}
                  alt=""
                  className="w-72 h-72 object-contain opacity-[0.06] blur-[2px] scale-110"
                />
              </div>
            )}

            {/* Radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(39,39,42,0.6)_0%,transparent_70%)] pointer-events-none" />

            {/* Top label */}
            <div className="absolute top-6 left-7 right-7 flex items-start justify-between">
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-zinc-700">
                Brand Spotlight
              </span>
              {featured.category && (
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-700 border border-zinc-800 rounded-full px-2.5 py-0.5">
                  {featured.category}
                </span>
              )}
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-7">
              {/* Country/region */}
              {featured.country && (
                <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 mb-2">
                  {featured.country}
                </p>
              )}

              {/* Brand name — editorial serif */}
              <h2
                className="text-5xl md:text-6xl font-light text-white leading-[1] tracking-tight mb-3 group-hover:text-zinc-100 transition-colors duration-300"
                style={{ fontFamily: "var(--font-editorial)" }}
              >
                {featured.name}
              </h2>

              {/* Description excerpt */}
              {featured.description && (
                <p className="text-zinc-500 text-[13px] leading-relaxed line-clamp-2 mb-5 max-w-md">
                  {featured.description}
                </p>
              )}

              {/* CTA */}
              <span className="inline-flex items-center gap-2 text-[11px] font-medium text-zinc-500 group-hover:text-white transition-colors duration-300 uppercase tracking-[0.15em]">
                Explore Brand
                <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                  →
                </span>
              </span>
            </div>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent pointer-events-none" />
          </Link>
        </motion.div>

        {/* Side cards — right, spans 2 cols */}
        <div className="md:col-span-2 flex flex-col gap-3">
          {rest.slice(0, 2).map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.15, duration: 0.4 }}
              className="flex-1"
            >
              <Link
                href={`/brands/${brand.id}`}
                className="relative block h-full min-h-[120px] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/50 group cursor-pointer p-6"
              >
                {/* Faint logo */}
                {resolveLogoUrl(brand.logo_url) && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <img
                      src={resolveLogoUrl(brand.logo_url)}
                      alt=""
                      className="w-14 h-14 object-contain opacity-[0.08]"
                    />
                  </div>
                )}

                <div className="relative z-10 h-full flex flex-col justify-between">
                  {/* Top: category */}
                  {brand.category && (
                    <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-zinc-700">
                      {brand.category}
                    </span>
                  )}

                  {/* Bottom: name + arrow */}
                  <div>
                    <h3
                      className="text-2xl font-light text-white tracking-tight leading-tight group-hover:text-zinc-200 transition-colors duration-300"
                      style={{ fontFamily: "var(--font-editorial)" }}
                    >
                      {brand.name}
                    </h3>
                    <span className="text-[10px] text-zinc-700 group-hover:text-zinc-500 transition-colors duration-300 mt-1 inline-flex items-center gap-1 uppercase tracking-[0.15em]">
                      View
                      <span className="group-hover:translate-x-0.5 transition-transform inline-block">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* If only 1 side brand, fill the gap with a "discover more" card */}
          {rest.length < 2 && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="flex-1"
            >
              <Link
                href="/"
                className="relative block h-full min-h-[120px] rounded-2xl overflow-hidden border border-dashed border-zinc-800 group cursor-pointer p-6 flex flex-col justify-end"
              >
                <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-zinc-700">
                  Discover
                </span>
                <p
                  className="text-2xl font-light text-zinc-600 group-hover:text-zinc-400 transition-colors duration-300 mt-2"
                  style={{ fontFamily: "var(--font-editorial)" }}
                >
                  300+ Brands
                </p>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function EditorialSkeleton() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 pb-2 pt-8">
      <div className="flex items-center gap-4 mb-5">
        <div className="h-2 w-14 bg-zinc-800 rounded animate-pulse" />
        <div className="flex-1 h-px bg-zinc-800" />
        <div className="h-2 w-20 bg-zinc-800 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="md:col-span-3 min-h-[380px] bg-zinc-950 rounded-2xl border border-zinc-800/50 animate-pulse" />
        <div className="md:col-span-2 flex flex-col gap-3">
          <div className="flex-1 min-h-[120px] bg-zinc-950 rounded-2xl border border-zinc-800/50 animate-pulse" />
          <div className="flex-1 min-h-[120px] bg-zinc-950 rounded-2xl border border-zinc-800/50 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
