"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";
import BrandCard from "@/components/brands/BrandCard";
import Header from "@/components/header";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/favorites/`,
        { withCredentials: true }
      );
      setFavorites(res.data);
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteChange = (_brandId: number, nowFavorited: boolean) => {
    if (!nowFavorited) fetchFavorites();
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col">
      <Head>
        <title>Your Favorites | Switch</title>
        <meta name="description" content="Your saved brands on Switch." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Header />
      <main className="max-w-5xl mx-auto w-full py-10 px-4">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Your Favorites</h1>

        {favorites.length === 0 && (
          <p className="text-gray-500">You haven't favorited anything yet.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((b: any) => (
            <BrandCard
              key={b.id}
              id={b.id}
              name={b.name}
              imageUrl={b.logo_url}
              isFavorited={true}
              isLoggedIn={true}
              onFavoriteChange={handleFavoriteChange}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
