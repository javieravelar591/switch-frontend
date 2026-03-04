"use client";

import React, { useEffect, useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import Carousel from '@/components/carousel'
import BrandCard from "../brands";
import RecommendedCarousel from "../recommendations/RecommendedCarousel";

type Brand = {
  id: number;
  name: string;
  logo_url?: string;
  website?: string;
  category?: string;
  description?: string;
};

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Streetwear", value: "streetwear" },
  { label: "Luxury", value: "luxury" },
];

const LIMIT = 12;

function SkeletonCard() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-zinc-800" />
      <div className="px-3 py-3 flex flex-col gap-2">
        <div className="h-3 bg-zinc-800 rounded w-3/4" />
        <div className="h-2 bg-zinc-800 rounded w-1/3" />
      </div>
    </div>
  );
}

export default function MasonryGrid() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favoritedIds, setFavoritedIds] = useState<Set<number>>(new Set());
  const [recommendedBrands, setRecommendedBrands] = useState<Brand[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchRecommendations = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands/recommendations`, {
        credentials: "include",
      });
      if (res.ok) {
        const data: Brand[] = await res.json();
        setRecommendedBrands(data);
      }
    } catch {
      // non-critical
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/favorites`, { credentials: "include" });
      if (res.status === 401) {
        setIsLoggedIn(false);
        window.location.href = "/login";
        return;
      }
      if (res.ok) {
        const data: Brand[] = await res.json();
        setFavoritedIds(new Set(data.map((b) => b.id)));
      }
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          setIsLoggedIn(true);
          fetchFavorites();
          fetchRecommendations();
        }
      })
      .catch(() => {});
  }, []);

  const fetchBrands = useCallback(async (currentSkip: number, category: string) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const categoryParam = category ? `&category=${category}` : "";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/brands?skip=${currentSkip}&limit=${LIMIT}${categoryParam}`
      );
      if (!res.ok) throw new Error("Failed to fetch brands");
      const data: Brand[] = await res.json();
      setBrands((prev) => currentSkip === 0 ? data : [...prev, ...data]);
      setSkip(currentSkip + LIMIT);
      if (data.length < LIMIT) setHasMore(false);
      else setHasMore(true);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setInitialLoading(false);
    }
  }, [isLoading]);

  // Initial load
  useEffect(() => {
    fetchBrands(0, activeCategory);
  }, []);

  // Reset when category changes
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setBrands([]);
    setSkip(0);
    setHasMore(true);
    setInitialLoading(true);
    fetchBrands(0, category);
  };

  const handleFavoriteToggle = (brandId: number, nowFavorited: boolean) => {
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      if (nowFavorited) next.add(brandId);
      else next.delete(brandId);
      return next;
    });
    fetchRecommendations();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Carousel */}
      <div className="w-full">
        <Carousel brands={brands} />
      </div>

      {/* Recommended carousel (logged in only) */}
      {isLoggedIn && <RecommendedCarousel brands={recommendedBrands} />}

      {/* Section header + category filters */}
      <div className="px-4 flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <h2 className="text-white text-xl font-semibold tracking-tight">
            {activeCategory
              ? CATEGORIES.find((c) => c.value === activeCategory)?.label
              : "All Brands"}
          </h2>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeCategory === cat.value
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {initialLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={brands.length}
          next={() => fetchBrands(skip, activeCategory)}
          hasMore={hasMore}
          loader={
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4 mt-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          }
          endMessage={
            <p className="text-center mt-8 mb-4 text-zinc-600 text-sm">
              You've seen all {brands.length} brands.
            </p>
          }
          scrollThreshold={0.8}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4">
            {brands.map((brand) => (
              <BrandCard
                key={brand.id}
                id={brand.id}
                name={brand.name}
                imageUrl={brand.logo_url}
                category={brand.category}
                description={brand.description}
                isLoggedIn={isLoggedIn}
                isFavorited={favoritedIds.has(brand.id)}
                onFavoriteChange={handleFavoriteToggle}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}
