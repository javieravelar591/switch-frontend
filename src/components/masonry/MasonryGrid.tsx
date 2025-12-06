"use client";

import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";


import Carousel from '@/components/carousel'
import BrandCard from "../brands";

// Optional: define your Brand type if not imported
type Brand = {
  id: number;
  name: string;
  logo_url?: string;
  website?: string;
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
    <>
      <div className="w-full max-w-6xl mx-auto mb-6">
        <Carousel brands={brands} />
      </div>
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
            <BrandCard
              id={i}
              name={brand.name}
              imageUrl={brand.logo_url}
              // tags={}
              // website={}
            />
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
    </>
  );
}
