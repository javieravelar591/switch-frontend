"use client";

import { useEffect, useRef, useState } from "react";

type Brand = {
  id: number;
  name: string;
  logo_url?: string | null;
  website?: string | null;
};

export default function Carousel({ brands }: { brands: Brand[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [displayBrands, setDisplayBrands] = useState<Brand[]>([]);

  // Pick a random set of 24 brands once on first load, never re-shuffle
  useEffect(() => {
    if (brands.length > 0 && displayBrands.length === 0) {
      const shuffled = [...brands].sort(() => Math.random() - 0.5).slice(0, 24);
      setDisplayBrands(shuffled);
    }
  }, [brands.length]);

  // Seamless infinite scroll: render items twice, jump back by half scrollWidth when
  // we reach the halfway point — visually identical position, no flicker
  useEffect(() => {
    if (!scrollRef.current || displayBrands.length === 0) return;

    let animationFrame: number;
    const speed = 0.5;

    const scroll = () => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollLeft += speed;

      const halfWidth = scrollRef.current.scrollWidth / 2;
      if (scrollRef.current.scrollLeft >= halfWidth) {
        scrollRef.current.scrollLeft -= halfWidth;
      }

      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrame);
  }, [displayBrands]);

  // Duplicate for seamless loop
  const items = [...displayBrands, ...displayBrands];

  if (items.length === 0) return null;

  return (
    <div
      ref={scrollRef}
      className="flex gap-4 overflow-x-hidden py-4"
      style={{ scrollbarWidth: "none" }}
    >
      {items.map((brand, i) => (
        <a
          key={`${brand.id}-${i}`}
          href={brand.website ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 w-40 h-40 rounded-xl shadow-lg bg-white cursor-pointer flex items-center justify-center p-4"
        >
          {brand.logo_url ? (
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="w-3/4 h-3/4 object-contain"
            />
          ) : (
            <span className="text-lg font-semibold text-gray-700">{brand.name}</span>
          )}
        </a>
      ))}
    </div>
  );
}
