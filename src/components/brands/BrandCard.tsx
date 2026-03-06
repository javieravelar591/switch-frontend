import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

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
  popular?: boolean;
  index?: number;
  onFavoriteChange?: (brandId: number, nowFavorited: boolean) => void;
}

export default function BrandCard({
  id,
  name,
  imageUrl,
  category,
  description,
  isFavorited = false,
  isLoggedIn = false,
  popular = false,
  index = 0,
  onFavoriteChange,
}: BrandCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [hovered, setHovered] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/60 cursor-pointer"
      style={{ transition: "box-shadow 0.3s ease" }}
    >
      <Link href={`/brands/${id}`} className="block">
        {/* Image area */}
        <motion.div
          className="relative w-full aspect-square overflow-hidden"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center p-8">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-3/4 h-3/4 object-contain"
              />
            ) : (
              <span className="text-white text-4xl font-bold tracking-tight">
                {name[0]}
              </span>
            )}
          </div>

          {/* Cinematic gradient fade into content */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent pointer-events-none" />

          {/* Description slide-up on hover */}
          {description && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 bg-gradient-to-t from-zinc-900 via-zinc-900/90 to-transparent pointer-events-none"
            >
              <p className="text-zinc-300 text-[11px] leading-relaxed line-clamp-3">
                {description}
              </p>
            </motion.div>
          )}

          {/* Hot badge */}
          {popular && (
            <div className="absolute top-3 left-3 px-2 py-0.5 bg-orange-500 text-white text-[9px] font-bold rounded-full tracking-wide uppercase">
              Hot
            </div>
          )}

          {/* Favorite button */}
          {isLoggedIn && (
            <motion.button
              onClick={toggleFavorite}
              whileTap={{ scale: 0.8 }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-black/70 cursor-pointer"
              aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            >
              {favorited
                ? <FaHeart size={13} className="text-red-400" />
                : <FaRegHeart size={13} className="text-zinc-400" />
              }
            </motion.button>
          )}
        </motion.div>

        {/* Content */}
        <div className="px-4 py-3 bg-zinc-900">
          {category && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-1">
              {category}
            </p>
          )}
          <h2 className="font-semibold text-sm text-white leading-tight truncate">
            {name}
          </h2>
          {description && (
            <p className="text-[11px] text-zinc-500 leading-relaxed mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
