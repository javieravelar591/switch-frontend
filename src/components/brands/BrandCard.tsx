import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

interface BrandCardProps {
  id: number;
  name: string;
  imageUrl?: string;
  category?: string;
  description?: string;
  tags?: string[];
  website?: string;
  isFavorited?: boolean;
  isLoggedIn?: boolean;
  onFavoriteChange?: (brandId: number, nowFavorited: boolean) => void;
}

export default function BrandCard({
  id,
  name,
  imageUrl,
  category,
  description,
  website,
  isFavorited = false,
  isLoggedIn = false,
  onFavoriteChange,
}: BrandCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [hovered, setHovered] = useState(false);

  const toggleFavorite = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/brands/${id}/favorite`,
        {},
        { withCredentials: true }
      );
      const nowFavorited: boolean = res.data.favorited;
      setFavorited(nowFavorited);
      onFavoriteChange?.(id, nowFavorited);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        window.location.href = "/login";
      } else {
        console.error("Failed to update favorite:", err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group"
      style={{
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.5)" : "0 1px 4px rgba(0,0,0,0.3)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}
    >
      {/* Logo area */}
      <a href={website ?? "#"} target="_blank" rel="noopener noreferrer" className="block">
        <div className="w-full aspect-square bg-white flex items-center justify-center p-6 relative overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-3/4 h-3/4 object-contain" />
          ) : (
            <span className="text-zinc-400 text-2xl font-bold">{name[0]}</span>
          )}

          {/* Description overlay on hover */}
          {description && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/75 flex items-center justify-center p-4"
            >
              <p className="text-white text-xs leading-relaxed text-center line-clamp-4">
                {description}
              </p>
            </motion.div>
          )}
        </div>
      </a>

      {/* Info row */}
      <div className="px-3 py-3 flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <h2 className="font-semibold text-sm text-white truncate leading-tight">{name}</h2>
          {category && (
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
              {category}
            </span>
          )}
        </div>
        {isLoggedIn && (
          <motion.button
            onClick={toggleFavorite}
            whileTap={{ scale: 0.8 }}
            className="flex-shrink-0 text-zinc-600 hover:text-red-400 transition-colors"
            style={{ color: favorited ? "#f87171" : undefined }}
          >
            {favorited ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
