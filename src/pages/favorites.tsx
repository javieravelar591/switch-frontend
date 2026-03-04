"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BrandCard from "@/components/brands/BrandCard";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

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

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>

      {favorites.length === 0 && (
        <p className="text-gray-600">You haven’t favorited anything yet.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((b: any) => (
          <BrandCard
            key={b.id}
            id={b.id}
            name={b.name}
            // description={b.description}
            // logo_url={b.logo_url}
            isFavorited={true}         // <-- Favorites page = always true
            onFavoriteChange={fetchFavorites}
          />
        ))}
      </div>
    </div>
  );
}
