"use client";

import { Suspense, useState, useEffect } from "react";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import Header from "@/components/header";
import Hero from "@/components/hero/Hero";
import BrandTicker from "@/components/brands/BrandTicker";

function MasonryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4 pt-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden animate-pulse">
          <div className="aspect-square bg-zinc-800" />
          <div className="px-3 py-3 flex flex-col gap-2">
            <div className="h-3 bg-zinc-800 rounded w-3/4" />
            <div className="h-2 bg-zinc-800 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, { credentials: "include" })
      .then((res) => { if (res.ok) setIsLoggedIn(true); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Header />
      <Hero isLoggedIn={isLoggedIn} />
      <BrandTicker />
      <main id="brand-grid" className="w-full max-w-6xl mx-auto pt-10 pb-20">
        <Suspense fallback={<MasonryGridSkeleton />}>
          <MasonryGrid />
        </Suspense>
      </main>
    </div>
  );
}
