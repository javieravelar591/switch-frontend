import Image from "next/image";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";

import { useState } from "react";

interface BrandCardProps {
  id: number;
  name: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  website?: string;
  isFavorited?: boolean;
  isLoggedIn?: boolean;
  onFavoriteChange?: () => void;
}

export default function BrandCard({
  id,
  name,
  imageUrl,
  category,
  tags,
  website,
  isFavorited=false,
  isLoggedIn=false,
  onFavoriteChange
}: BrandCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);

  const toggleFavorite = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/brands/${id}/favorite`,
        {},
        { withCredentials: true }
      );

      setFavorited(!favorited);

      // Inform parent to refresh brand list if needed
      onFavoriteChange?.();
    } catch (err) {
      console.error("Failed to update favorite:", err);
    }
  };

  return (
    <motion.div
      key={id}
      style={{ willChange: "opacity, transform" }}
      initial={{ opacity: 0.4, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: id * .001  }}
      className="break-inside-avoid mb-4 bg-white rounded-xl shadow hover:shadow-lg transition-all cursor-pointer border"
    >
      <div
        key={id}
        className="break-inside-avoid mb-4 bg-white rounded-xl shadow hover:shadow-lg transition-all cursor-pointer border opacity-100"
        style={{
          animation: `fadeInUp 0.4s ease ${id * 0.03}s both`,
        }}
      >
        <a
          href={website ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded-t-xl overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-600 text-xl font-semibold">
                {name[0]}
              </span>
            )}
          </div>
        </a>

        <div className="p-4 flex items-center justify-between">
          <h2 className="font-semibold text-lg truncate">{name}</h2>
          {isLoggedIn && (
            <button
              onClick={toggleFavorite}
              className="text-red-500 hover:text-red-600 transition-colors flex-shrink-0"
            >
              {favorited ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
