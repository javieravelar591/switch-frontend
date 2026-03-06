"use client";

import React, { useEffect, useState, useRef } from "react";
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
  popular?: boolean;
};

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Streetwear", value: "streetwear" },
  { label: "Luxury", value: "luxury" },
];

const REGIONS = [
  { label: "All Regions", value: "" },
  { label: "North America", value: "north-america" },
  { label: "Europe", value: "europe" },
  { label: "East Asia", value: "east-asia" },
  { label: "Latin America", value: "latin-america" },
  { label: "Africa", value: "africa" },
  { label: "South Asia", value: "south-asia" },
  { label: "Southeast Asia", value: "southeast-asia" },
];

const SORT_OPTIONS = [
  { label: "Default", value: "" },
  { label: "A–Z", value: "name" },
  { label: "Most Favorited", value: "popular" },
  { label: "Newest", value: "newest" },
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favoritedIds, setFavoritedIds] = useState<Set<number>>(new Set());
  const [carouselBrands, setCarouselBrands] = useState<Brand[]>([]);
  const [recommendedBrands, setRecommendedBrands] = useState<Brand[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeRegion, setActiveRegion] = useState("");
  const [activeSort, setActiveSort] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const isLoadingRef = useRef(false);

  const fetchCarouselBrands = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands?limit=50`);
      if (res.ok) setCarouselBrands(await res.json());
    } catch { /* non-critical */ }
  };

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
    fetchCarouselBrands();
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

  const fetchBrands = async (
    currentSkip: number,
    category: string,
    region: string,
    sort: string
  ) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    try {
      const params = new URLSearchParams({ skip: String(currentSkip), limit: String(LIMIT) });
      if (category) params.set("category", category);
      if (region) params.set("region", region);
      if (sort) params.set("sort", sort);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands?${params}`);
      if (!res.ok) throw new Error("Failed to fetch brands");
      const data: Brand[] = await res.json();
      setBrands((prev) => currentSkip === 0 ? data : [...prev, ...data]);
      setSkip(currentSkip + LIMIT);
      setHasMore(data.length === LIMIT);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setHasMore(false);
    } finally {
      isLoadingRef.current = false;
      setInitialLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBrands(0, activeCategory, activeRegion, activeSort);
  }, []);

  const resetAndFetch = (category: string, region: string, sort: string) => {
    setBrands([]);
    setSkip(0);
    setHasMore(true);
    setInitialLoading(true);
    isLoadingRef.current = false;
    fetchBrands(0, category, region, sort);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    resetAndFetch(category, activeRegion, activeSort);
  };

  const handleRegionChange = (region: string) => {
    setActiveRegion(region);
    resetAndFetch(activeCategory, region, activeSort);
  };

  const handleSortChange = (sort: string) => {
    setActiveSort(sort);
    resetAndFetch(activeCategory, activeRegion, sort);
  };

  const clearAllFilters = () => {
    setActiveCategory("");
    setActiveRegion("");
    resetAndFetch("", "", activeSort);
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

  const sectionLabel = activeCategory || activeRegion
    ? [
        CATEGORIES.find((c) => c.value === activeCategory)?.label,
        REGIONS.find((r) => r.value === activeRegion && r.value !== "")?.label,
      ].filter(Boolean).join(" · ") || "All Brands"
    : "All Brands";

  return (
    <div className="flex flex-col gap-6">
      {/* Carousel */}
      <div className="w-full">
        <Carousel brands={carouselBrands} />
      </div>

      {/* Recommended carousel (logged in only) */}
      {isLoggedIn && <RecommendedCarousel brands={recommendedBrands} />}

      {/* Section header + filters */}
      <div className="px-4 flex flex-col gap-4">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <h2 className="text-white text-xl font-semibold tracking-tight">
            {sectionLabel}
          </h2>

          {/* Sort dropdown */}
          <select
            value={activeSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-zinc-900 text-zinc-400 text-xs border border-zinc-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500/60 cursor-pointer hover:text-white transition-colors"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.value ? `Sort: ${opt.label}` : "Sort: Default"}
              </option>
            ))}
          </select>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  activeCategory === cat.value
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {REGIONS.map((r) => (
              <button
                key={r.value}
                onClick={() => handleRegionChange(r.value)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                  activeRegion === r.value
                    ? "bg-zinc-600 text-white"
                    : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-300"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
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
          next={() => fetchBrands(skip, activeCategory, activeRegion, activeSort)}
          hasMore={hasMore}
          loader={
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4 mt-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          }
          endMessage={
            brands.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <p className="text-white text-sm font-medium mb-1">No brands found</p>
                <p className="text-zinc-600 text-xs max-w-[220px] leading-relaxed mb-5">
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-medium hover:bg-zinc-800 hover:border-zinc-500 transition-colors cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <p className="text-center mt-8 mb-4 text-zinc-700 text-xs tracking-widest uppercase">
                {`— ${brands.length} brands —`}
              </p>
            )
          }
          scrollThreshold={0.8}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4">
            {brands.map((brand, i) => (
              <BrandCard
                key={brand.id}
                id={brand.id}
                name={brand.name}
                imageUrl={brand.logo_url}
                category={brand.category}
                description={brand.description}
                isLoggedIn={isLoggedIn}
                isFavorited={favoritedIds.has(brand.id)}
                popular={brand.popular}
                index={i}
                onFavoriteChange={handleFavoriteToggle}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}
