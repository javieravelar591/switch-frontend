"use client";

import { useState, useEffect } from "react";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import Header from "@/components/header";
import Hero from "@/components/hero/Hero";

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
      <main id="brand-grid" className="w-full max-w-6xl mx-auto pt-10 pb-20">
        <MasonryGrid />
      </main>
    </div>
  );
}
