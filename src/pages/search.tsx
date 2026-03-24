import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import InfiniteScroll from "react-infinite-scroll-component";
import Footer from "@/components/footer/Footer";
import BrandCard from "@/components/brands/BrandCard";

type Brand = {
  id: number;
  name: string;
  logo_url?: string;
  category?: string;
  description?: string;
  popular?: boolean;
};

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

export default function SearchPage() {
  const router = useRouter();
  const query = (router.query.q as string) || "";

  const [brands, setBrands] = useState<Brand[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favoritedIds, setFavoritedIds] = useState<Set<number>>(new Set());
  const [initialLoading, setInitialLoading] = useState(true);
  const isLoadingRef = useRef(false);

  const fetchBrands = async (currentSkip: number, search: string) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    try {
      const params = new URLSearchParams({ skip: String(currentSkip), limit: String(LIMIT) });
      if (search) params.set("search", search);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands?${params}`);
      if (!res.ok) throw new Error();
      const data: Brand[] = await res.json();
      setBrands((prev) => (currentSkip === 0 ? data : [...prev, ...data]));
      setSkip(currentSkip + LIMIT);
      setHasMore(data.length === LIMIT);
    } catch {
      setHasMore(false);
    } finally {
      isLoadingRef.current = false;
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) return;
        setIsLoggedIn(true);
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/favorites`, { credentials: "include" });
      })
      .then((res) => (res?.ok ? res.json() : []))
      .then((data: Brand[]) => setFavoritedIds(new Set(data.map((b) => b.id))))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    setBrands([]);
    setSkip(0);
    setHasMore(true);
    setInitialLoading(true);
    isLoadingRef.current = false;
    fetchBrands(0, query);
  }, [query, router.isReady]);

  const handleFavoriteToggle = (brandId: number, nowFavorited: boolean) => {
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      if (nowFavorited) next.add(brandId);
      else next.delete(brandId);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Head>
        <title>{query ? `"${query}" — Search | Switch` : "Search | Switch"}</title>
        <meta name="description" content={query ? `Search results for "${query}" on Switch.` : "Search brands on Switch."} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="w-full max-w-6xl mx-auto px-4 pt-10 pb-20 flex flex-col gap-8">
        {/* Search context */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-600 mb-2">
            Search Results
          </p>
          <h1
            className="text-4xl font-light text-white tracking-tight"
            style={{ fontFamily: "var(--font-editorial)" }}
          >
            {query ? `"${query}"` : "All Brands"}
          </h1>
          {!initialLoading && (
            <p className="text-zinc-600 text-xs mt-2">
              {brands.length} {brands.length === 1 ? "brand" : "brands"} found
            </p>
          )}
        </div>

        {/* Results */}
        {initialLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : brands.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-600"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <p className="text-white text-sm font-medium mb-1">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-zinc-600 text-xs max-w-[220px] leading-relaxed mb-5">
              Try a different search term or browse all brands.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-medium hover:bg-zinc-800 hover:border-zinc-500 transition-colors cursor-pointer"
            >
              Browse all brands
            </button>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={brands.length}
            next={() => fetchBrands(skip, query)}
            hasMore={hasMore}
            loader={
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            }
            endMessage={
              <p className="text-center mt-8 mb-4 text-zinc-700 text-xs tracking-widest uppercase">
                {`— ${brands.length} ${brands.length === 1 ? "brand" : "brands"} —`}
              </p>
            }
            scrollThreshold={0.8}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
      </main>
      <Footer />
    </div>
  );
}
