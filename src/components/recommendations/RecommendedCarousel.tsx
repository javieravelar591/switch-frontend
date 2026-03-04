"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

type Brand = {
  id: number;
  name: string;
  logo_url?: string;
  website?: string;
};

interface Props {
  brands: Brand[];
}

export default function RecommendedCarousel({ brands }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX;
    scrollStart.current = scrollRef.current?.scrollLeft ?? 0;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    scrollRef.current.scrollLeft = scrollStart.current - (e.pageX - startX.current);
  };

  const stopDrag = () => { isDragging.current = false; };

  if (brands.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-6">
      <h2 className="text-white text-sm font-semibold tracking-widest uppercase mb-3 opacity-60">
        Recommended for you
      </h2>
      {/* Outer div constrains width; inner div scrolls */}
      <div className="w-full overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-scroll pb-2 cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          {brands.map((brand, i) => (
            <motion.a
              key={brand.id}
              href={brand.website || "#"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="flex-shrink-0 w-32 rounded-xl overflow-hidden bg-white"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                // Prevent navigation if user was dragging
                if (Math.abs(scrollRef.current?.scrollLeft ?? 0 - scrollStart.current) > 5) {
                  e.preventDefault();
                }
              }}
            >
              <div className="w-32 h-32 flex items-center justify-center p-4">
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-700 text-xl font-bold">
                    {brand.name[0]}
                  </span>
                )}
              </div>
              <div className="bg-gray-50 px-2 py-1.5 border-t border-gray-100">
                <p className="text-gray-800 text-xs font-medium truncate text-center">
                  {brand.name}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
