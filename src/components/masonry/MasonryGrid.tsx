import React from "react";

interface MasonryGridProps {
  items: {
    id: number;
    name: string;
    logo_url?: string | null;
    website?: string | null;
  }[];
}

export default function MasonryGrid({ items }: MasonryGridProps) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 px-4">
      {items.map((brand) => (
        <div
          key={brand.id}
          className="break-inside-avoid mb-4 bg-white rounded-xl shadow hover:shadow-lg transition-all cursor-pointer border"
        >
          <a
            href={brand.website ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* Logo / image placeholder */}
            <div className="w-full aspect-square bg-gray-200 flex items-center justify-center rounded-t-xl overflow-hidden">
              {brand.logo_url ? (
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-600 font-semibold">
                  {brand.name[0]}
                </span>
              )}
            </div>

            <div className="p-4">
              <h2 className="font-semibold text-lg">{brand.name}</h2>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
}
