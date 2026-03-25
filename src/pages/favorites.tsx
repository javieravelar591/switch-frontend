import { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";
import { FiStar, FiHeart } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import BrandCard from "@/components/brands/BrandCard";
import withAuth from "@/components/hoc/withAuth";
import { useAuth } from "@/context/AuthContext";

function FavoritesPage() {
  const { user, refresh } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/favorites`,
        { withCredentials: true }
      );
      setFavorites(res.data);
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  };

  useEffect(() => {
    fetchFavorites();
    refresh(); // pick up any style profile generated since last auth check
  }, []);

  const handleFavoriteChange = (_brandId: number, nowFavorited: boolean) => {
    if (!nowFavorited) {
      fetchFavorites();
      setTimeout(refresh, 3000); // re-check profile after background task completes
    }
  };

  const userInitial =
    user?.username?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Head>
        <title>Your Favorites | Switch</title>
        <meta name="description" content="Your saved brands on Switch." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="max-w-5xl mx-auto w-full py-10 px-4 flex flex-col gap-8">

        {/* Page header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {userInitial}
          </div>
          <div>
            <h1 className="text-white text-xl font-semibold tracking-tight">
              {user?.username || user?.email?.split("@")[0] || "Your"} Favorites
            </h1>
            <p className="text-zinc-600 text-xs">
              {favorites.length} {favorites.length === 1 ? "brand" : "brands"} saved
            </p>
          </div>
        </div>

        {/* Style profile card */}
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5">
          <div className="flex items-center gap-2 mb-3">
            <FiStar size={13} className="text-indigo-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Your Style Profile
            </span>
          </div>

          {user?.style_profile ? (
            <div className="text-sm leading-relaxed text-zinc-300">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-white font-semibold text-base mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-white font-semibold text-sm mb-1.5">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-zinc-200 font-medium text-sm mb-1">{children}</h3>,
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="text-zinc-300 italic">{children}</em>,
                  ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                  li: ({ children }) => <li className="text-zinc-400">{children}</li>,
                }}
              >
                {user.style_profile}
              </ReactMarkdown>
            </div>
          ) : favorites.length >= 3 ? (
            <p className="text-zinc-600 text-sm">
              Your style profile is being generated — check back shortly.
            </p>
          ) : (
            <p className="text-zinc-600 text-sm">
              Favorite{" "}
              <span className="text-zinc-400 font-medium">
                {3 - favorites.length} more {3 - favorites.length === 1 ? "brand" : "brands"}
              </span>{" "}
              to unlock your personalized style profile.
            </p>
          )}
        </div>

        {/* Favorites grid */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5">
              <FiHeart size={20} className="text-zinc-600" />
            </div>
            <p className="text-white text-sm font-medium mb-1">No favorites yet</p>
            <p className="text-zinc-600 text-xs max-w-[220px] leading-relaxed">
              Browse brands and tap the heart to save ones you love.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((b: any) => (
              <BrandCard
                key={b.id}
                id={b.id}
                name={b.name}
                imageUrl={b.logo_url}
                category={b.category}
                description={b.description}
                isFavorited={true}
                isLoggedIn={true}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default withAuth(FavoritesPage);
