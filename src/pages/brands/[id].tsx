import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";
import { FaHeart, FaRegHeart, FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";
import Header from "@/components/header";
import Footer from "@/components/footer/Footer";

type Brand = {
  id: number;
  name: string;
  logo_url?: string;
  website?: string;
  category?: string;
  description?: string;
  tags?: string[];
  region?: string;
  country?: string;
  popular?: boolean;
};

type Article = {
  id: number;
  title: string;
  url: string;
  source?: string;
  published_at?: string;
  image_url?: string;
  summary?: string;
};

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function HeroSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="w-full bg-zinc-950 border-b border-zinc-800/40 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6 pt-8 pb-16 animate-pulse">
          <div className="w-28 h-28 bg-zinc-800 rounded-2xl" />
          <div className="h-12 bg-zinc-800 rounded w-64" />
          <div className="h-3 bg-zinc-800 rounded w-32" />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-4 animate-pulse">
        <div className="h-3 bg-zinc-800 rounded w-full" />
        <div className="h-3 bg-zinc-800 rounded w-5/6" />
        <div className="h-3 bg-zinc-800 rounded w-4/6" />
      </div>
    </div>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="group block rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/60 hover:border-zinc-700/80 transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="aspect-video w-full bg-zinc-900 overflow-hidden">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt=""
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).parentElement!.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-zinc-700 text-xs font-medium">{article.source}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-[13px] text-zinc-200 font-medium leading-snug group-hover:text-white transition-colors line-clamp-2 mb-2.5">
          {article.title}
        </p>
        {article.summary && (
          <p className="text-[11px] text-zinc-600 leading-relaxed line-clamp-2 mb-3">
            {article.summary}
          </p>
        )}
        <div className="flex items-center gap-2">
          {article.source && (
            <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wide">
              {article.source}
            </span>
          )}
          {article.published_at && (
            <>
              <span className="text-zinc-800">·</span>
              <span className="text-[10px] text-zinc-700">{timeAgo(article.published_at)}</span>
            </>
          )}
        </div>
      </div>
    </motion.a>
  );
}

function SimilarBrandCard({ brand }: { brand: Brand }) {
  return (
    <Link href={`/brands/${brand.id}`} className="flex-shrink-0 w-28 group cursor-pointer">
      <div className="w-28 h-28 bg-zinc-950 border border-zinc-800/60 rounded-xl overflow-hidden flex items-center justify-center p-3 group-hover:border-zinc-700 transition-colors duration-300">
        {brand.logo_url ? (
          <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
        ) : (
          <span className="text-2xl font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors">
            {brand.name[0]}
          </span>
        )}
      </div>
      <p className="text-[11px] text-zinc-500 mt-2 text-center truncate group-hover:text-zinc-300 transition-colors duration-300">
        {brand.name}
      </p>
    </Link>
  );
}

export default function BrandPage() {
  const router = useRouter();
  const { id } = router.query;

  const [brand, setBrand] = useState<Brand | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [similarBrands, setSimilarBrands] = useState<Brand[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [brandLoading, setBrandLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, { credentials: "include" })
      .then((res) => { if (res.ok) setIsLoggedIn(true); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands/${id}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data: Brand | null) => {
        if (data) {
          setBrand(data);
          if (data.category) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands?category=${data.category}&limit=10&sort=popular`)
              .then((res) => res.ok ? res.json() : [])
              .then((similar: Brand[]) =>
                setSimilarBrands(similar.filter((b) => b.id !== data.id).slice(0, 8))
              );
          }
        }
      })
      .finally(() => setBrandLoading(false));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands/${id}/articles`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setArticles(data))
      .finally(() => setArticlesLoading(false));
  }, [id]);

  useEffect(() => {
    if (!isLoggedIn || !id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/favorites`, { credentials: "include" })
      .then((res) => res.ok ? res.json() : [])
      .then((favs: Brand[]) => setFavorited(favs.some((b) => b.id === Number(id))));
  }, [isLoggedIn, id]);

  const toggleFavorite = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/brands/${id}/favorite`,
        {},
        { withCredentials: true }
      );
      setFavorited(res.data.favorited);
    } catch (err: any) {
      if (err?.response?.status === 401) router.push("/login");
    }
  };

  if (brandLoading) return <HeroSkeleton />;

  if (!brand) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <span className="text-zinc-600 text-lg font-light" style={{ fontFamily: "var(--font-editorial)" }}>?</span>
          </div>
          <p className="text-zinc-500 text-sm">Brand not found</p>
          <Link href="/" className="text-xs text-zinc-600 hover:text-white transition-colors">
            ← Back to all brands
          </Link>
        </div>
      </div>
    );
  }

  const metaLine = [brand.category, brand.country].filter(Boolean).join(" · ");

  return (
    <>
      <Head>
        <title>{brand.name} | Switch</title>
        <meta name="description" content={brand.description || `Discover ${brand.name} on Switch — the brand discovery platform for streetwear, luxury, and culture.`} />
        <meta property="og:title" content={`${brand.name} | Switch`} />
        <meta property="og:description" content={brand.description || `Explore ${brand.name} on Switch.`} />
        <meta property="og:type" content="website" />
        {brand.logo_url && <meta property="og:image" content={brand.logo_url} />}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${brand.name} | Switch`} />
        <meta name="twitter:description" content={brand.description || `Explore ${brand.name} on Switch.`} />
        {brand.logo_url && <meta name="twitter:image" content={brand.logo_url} />}
      </Head>

      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />

        {/* ── Cinematic Hero ─────────────────────────────────── */}
        <div className="relative w-full bg-zinc-950 border-b border-zinc-800/40 overflow-hidden">
          {/* Radial atmospheric glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(39,39,42,0.7)_0%,transparent_65%)] pointer-events-none" />

          {/* Watermark logo */}
          {brand.logo_url && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img
                src={brand.logo_url}
                alt=""
                className="w-[420px] h-[420px] object-contain opacity-[0.04] blur-sm"
              />
            </div>
          )}

          {/* Nav bar */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 pt-7 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[11px] font-medium text-zinc-600 hover:text-white transition-colors duration-200 uppercase tracking-[0.15em]"
            >
              <FaArrowLeft size={10} />
              All Brands
            </Link>

            <div className="flex items-center gap-3">
              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 hover:text-white transition-colors duration-200 uppercase tracking-[0.15em]"
                >
                  Visit Site <FaExternalLinkAlt size={9} />
                </a>
              )}
              {isLoggedIn && (
                <motion.button
                  onClick={toggleFavorite}
                  whileTap={{ scale: 0.85 }}
                  className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-zinc-600 transition-colors duration-200 cursor-pointer"
                  aria-label={favorited ? "Remove from favorites" : "Save brand"}
                >
                  {favorited
                    ? <FaHeart size={13} className="text-red-400" />
                    : <FaRegHeart size={13} className="text-zinc-500" />
                  }
                </motion.button>
              )}
            </div>
          </div>

          {/* Hero content — centered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-20 flex flex-col items-center text-center"
          >
            {/* Logo */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white/95 rounded-2xl flex items-center justify-center p-4 shadow-2xl shadow-black/60 mb-8">
              {brand.logo_url ? (
                <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-4xl font-bold text-zinc-900">{brand.name[0]}</span>
              )}
            </div>

            {/* Brand name — editorial serif */}
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-none tracking-tight mb-4"
              style={{ fontFamily: "var(--font-editorial)" }}
            >
              {brand.name}
            </h1>

            {/* Meta line */}
            {metaLine && (
              <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-600 mt-1">
                {metaLine}
              </p>
            )}

            {/* Tags row */}
            {brand.tags && brand.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 mt-5">
                {brand.tags.slice(0, 6).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-500 text-[10px] rounded-full uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── About ──────────────────────────────────────────── */}
        {brand.description && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-3xl mx-auto px-6 py-14 md:py-20"
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-zinc-700 mb-7">
              About
            </p>
            <p
              className="text-zinc-300 text-lg md:text-xl leading-[1.85] font-light"
              style={{ fontFamily: "var(--font-editorial)" }}
            >
              {brand.description}
            </p>
          </motion.section>
        )}

        {/* ── Divider ──────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6">
          <div className="border-t border-zinc-800/60" />
        </div>

        {/* ── Latest News ─────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <div className="flex items-center gap-4 mb-8">
            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-zinc-600">
              Latest News & Drops
            </p>
            <div className="flex-1 h-px bg-zinc-800/60" />
          </div>

          {articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/60 animate-pulse">
                  <div className="aspect-video bg-zinc-900" />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="h-3 bg-zinc-800 rounded w-3/4" />
                    <div className="h-3 bg-zinc-800 rounded w-1/2" />
                    <div className="h-2 bg-zinc-800 rounded w-1/4 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-600">
                  <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10l6 6v10a2 2 0 0 1-2 2z" />
                  <polyline points="17,2 17,8 23,8" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                  <line x1="9" y1="11" x2="11" y2="11" />
                </svg>
              </div>
              <p className="text-zinc-500 text-sm">No recent coverage found</p>
              <p className="text-zinc-700 text-xs">Check back soon for updates on {brand.name}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* ── Similar Brands ──────────────────────────────── */}
        {similarBrands.length > 0 && (
          <section className="py-10 border-t border-zinc-800/60">
            <div className="max-w-5xl mx-auto px-6">
              <div className="flex items-center gap-4 mb-7">
                <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-zinc-600">
                  You Might Also Like
                </p>
                <div className="flex-1 h-px bg-zinc-800/60" />
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 max-w-5xl mx-auto pb-2">
              {similarBrands.map((b) => (
                <SimilarBrandCard key={b.id} brand={b} />
              ))}
            </div>
          </section>
        )}

        <Footer />
      </div>
    </>
  );
}

