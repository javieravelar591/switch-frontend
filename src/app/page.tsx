'use client'

import MasonryGrid from "@/components/masonry/MasonryGrid";
import Header from "@/components/header";

export default async function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center">
      <Header />
      <main className="w-full max-w-6xl">
        <MasonryGrid />
      </main>
    </div>
  );
}