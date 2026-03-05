"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";

const brandsRow1 = [
  "Supreme", "Off-White", "Palace", "Stone Island", "Kith",
  "Noah", "Stüssy", "Fear of God", "Rick Owens", "Aimé Leon Dore",
];

const brandsRow2 = [
  "Bottega Veneta", "Maison Margiela", "Balenciaga", "Acne Studios",
  "Lemaire", "Our Legacy", "Carhartt WIP", "A-COLD-WALL*", "C.P. Company", "Represent",
];

function BrandPill({ name }: { name: string }) {
  return (
    <span className="flex items-center gap-3 text-zinc-500 text-sm font-medium tracking-wide uppercase whitespace-nowrap">
      <span className="w-1 h-1 rounded-full bg-zinc-700 shrink-0" />
      {name}
    </span>
  );
}

export default function BrandTicker() {
  return (
    <div className="w-full py-6 border-b border-zinc-800/60 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex flex-col gap-3">
        <InfiniteSlider gap={32} duration={35} durationOnHover={80}>
          {brandsRow1.map((brand) => (
            <BrandPill key={brand} name={brand} />
          ))}
        </InfiniteSlider>
        <InfiniteSlider gap={32} duration={28} reverse durationOnHover={80}>
          {brandsRow2.map((brand) => (
            <BrandPill key={brand} name={brand} />
          ))}
        </InfiniteSlider>
      </div>
    </div>
  );
}
