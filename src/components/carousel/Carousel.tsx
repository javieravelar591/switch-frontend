"use client";

import { useEffect, useState } from "react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

type Brand = {
  id: number;
  name: string;
  logo_url?: string | null;
  website?: string | null;
};

export default function Carousel({ brands }: { brands: Brand[] }) {
  const [displayBrands, setDisplayBrands] = useState<Brand[]>([]);

  useEffect(() => {
    if (brands.length > 0 && displayBrands.length === 0) {
      const shuffled = [...brands].sort(() => Math.random() - 0.5).slice(0, 24);
      setDisplayBrands(shuffled);
    }
  }, [brands.length]);

  if (displayBrands.length === 0) return null;

  return (
    <InfiniteSlider gap={16} duration={40}>
      {displayBrands.map((brand) => (
        <a
          key={brand.id}
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
    </InfiniteSlider>
  );
}
