"use client";

import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion } from "framer-motion";

// Optional: define your Brand type if not imported
type Brand = {
  id: number;
  name: string;
  logo_url?: string | null;
  website?: string | null;
};

export default function MasonryGrid() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const LIMIT = 10;

  const fetchBrands = async () => {
    if (isLoading) return; // Prevent duplicate calls
    setIsLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/brands?skip=${skip}&limit=${LIMIT}`
      );
      if (!res.ok) throw new Error("Failed to fetch brands");

      const data: Brand[] = await res.json();

      setBrands((prev) => [...prev, ...data]);
      setSkip((prev) => prev + LIMIT);
      if (data.length < LIMIT) setHasMore(false);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands(); // Initial fetch
  }, []);

  return (
    <InfiniteScroll
      dataLength={brands.length}
      next={fetchBrands}
      hasMore={hasMore}
      loader={<h4 className="text-center my-4 animate-pulse">Loading...</h4>}
      endMessage={
        <p className="text-center my-4 text-gray-500">
          <b>You've reached the end 🎉</b>
        </p>
      }
      scrollThreshold={0.8}
    >
      <div className="columns-2 md:columns-3 gap-4 px-4 w-full max-w-6xl mx-auto">
        {brands.map((brand, i) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, y: 50 }}     // Start slightly below
            whileInView={{ opacity: 1, y: 0 }}  // Slide up into view
            viewport={{ once: true }}           // Animate only once
            transition={{ duration: 0.3, delay: i * 0.02 }} // Slight stagger
            className="break-inside-avoid mb-4 bg-white rounded-xl shadow hover:shadow-lg transition-all cursor-pointer border"
          >
            <div
              key={brand.id}
              className="break-inside-avoid mb-4 bg-white rounded-xl shadow hover:shadow-lg transition-all cursor-pointer border opacity-100"
              style={{
                animation: `fadeInUp 0.4s ease ${i * 0.03}s both`,
              }}
            >
              <a
                href={brand.website ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded-t-xl overflow-hidden">
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-xl font-semibold">
                      {brand.name[0]}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h2 className="font-semibold text-lg truncate">
                    {brand.name}
                  </h2>
                </div>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
      {/* <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style> */}
    </InfiniteScroll>
  );
}
