import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";
import { FaHeart, FaRegHeart, FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";
import Header from "@/components/header";

type Brand = {
  id: number;
  name: string;
  logo_url?: string;
  website?: string;
  category?: string;
  description?: string;
  tags?: string[];
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

function ArticleSkeleton() {
  return (
    <div className="flex gap-4 animate-pulse">
      <div className="flex-shrink-0 w-20 h-20 bg-zinc-800 rounded-lg" />
      <div className="flex-1 flex flex-col gap-2 py-1">
        <div className="h-3 bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-800 rounded w-1/2" />
        <div className="h-2 bg-zinc-800 rounded w-1/4 mt-1" />
      </div>
    </div>
  );
}

export default function BrandPage() {
  const router = useRouter();
  const { id } = router.query;

  const [brand, setBrand] = useState<Brand | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
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

    // Fetch brand
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands/${id}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (data) setBrand(data); })
      .finally(() => setBrandLoading(false));

    // Fetch articles (may take a few seconds on first load while RSS is fetched)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands/${id}/articles`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setArticles(data))
      .finally(() => setArticlesLoading(false));
  }, [id]);

  // Check if this brand is favorited
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

  if (brandLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse flex flex-col gap-6">
          <div className="h-24 w-24 bg-zinc-800 rounded-xl" />
          <div className="h-8 bg-zinc-800 rounded w-1/3" />
          <div className="h-4 bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-zinc-800 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-zinc-500">
        <Header />
        <p>Brand not found.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{brand.name} — Switch</title>
        <meta name="description" content={brand.description || `Discover ${brand.name} on Switch.`} />
      </Head>
      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />

        <main className="max-w-3xl mx-auto px-4 py-10">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm mb-8 transition-colors"
          >
            <FaArrowLeft size={12} /> All Brands
          </Link>

          {/* Brand header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-start gap-6 mb-8"
          >
            {/* Logo */}
            <div className="flex-shrink-0 w-24 h-24 bg-white rounded-xl flex items-center justify-center p-3">
              {brand.logo_url ? (
                <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-2xl font-bold text-zinc-500">{brand.name[0]}</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{brand.name}</h1>
                {isLoggedIn && (
                  <motion.button
                    onClick={toggleFavorite}
                    whileTap={{ scale: 0.8 }}
                    className="transition-colors"
                    style={{ color: favorited ? "#f87171" : "#52525b" }}
                  >
                    {favorited ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                  </motion.button>
                )}
              </div>

              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                {brand.category && (
                  <span className="text-xs uppercase tracking-widest text-zinc-500">
                    {brand.category}
                  </span>
                )}
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
                  >
                    Official site <FaExternalLinkAlt size={10} />
                  </a>
                )}
              </div>

              {/* Tags */}
              {brand.tags && brand.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {brand.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Description */}
          {brand.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-zinc-400 text-sm leading-relaxed mb-10 border-l-2 border-zinc-800 pl-4"
            >
              {brand.description}
            </motion.p>
          )}

          {/* Divider */}
          <div className="border-t border-zinc-800 mb-8" />

          {/* Articles */}
          <section>
            <h2 className="text-white font-semibold text-lg mb-6">Latest News & Drops</h2>

            {articlesLoading ? (
              <div className="flex flex-col gap-6">
                {Array.from({ length: 5 }).map((_, i) => <ArticleSkeleton key={i} />)}
              </div>
            ) : articles.length === 0 ? (
              <p className="text-zinc-600 text-sm">
                No recent news found for {brand.name}.
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                {articles.map((article, i) => (
                  <motion.a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="flex gap-4 p-4 rounded-xl hover:bg-zinc-900 transition-colors group"
                  >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-zinc-800">
                      {article.image_url ? (
                        <img
                          src={article.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-zinc-600 text-xs text-center px-2">{article.source}</span>
                        </div>
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <p className="text-sm text-zinc-200 font-medium leading-snug group-hover:text-white transition-colors line-clamp-2">
                        {article.title}
                      </p>
                      {article.summary && (
                        <p className="text-xs text-zinc-600 mt-1 line-clamp-2">
                          {article.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {article.source && (
                          <span className="text-[11px] text-zinc-500 font-medium">{article.source}</span>
                        )}
                        {article.published_at && (
                          <>
                            <span className="text-zinc-700">·</span>
                            <span className="text-[11px] text-zinc-600">{timeAgo(article.published_at)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
