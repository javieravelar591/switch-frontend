'use client'

import MasonryGrid from "@/components/masonry/MasonryGrid";
import BrandsPage from "@/pages/brands";

export default async function Home() {
  const res = await fetch("http://localhost:8000/brands", {
    cache: "no-store",
  });
  const brands = await res.json();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* <BrandsPage /> */}
      <MasonryGrid items={brands} />
    </div>
  );
}
