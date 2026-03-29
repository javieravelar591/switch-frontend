import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { resolveLogoUrl } from "@/lib/logoUrl";

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
  isFavorited = false,
  isLoggedIn = false,
  popular = false,
  index = 0,
  onFavoriteChange,
}: BrandCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [hovered, setHovered] = useState(false);
  const resolvedImage = resolveLogoUrl(imageUrl);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative cursor-pointer group"
    >
      <Link href={`/brands/${id}`} className="block">

        {/* Card face — portrait ratio, white background */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">

          {/* Popular accent — thin top border */}
          {popular && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-zinc-900 z-10" />
          )}

          {/* Logo / fallback */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            {resolvedImage ? (
              <motion.img
                src={resolvedImage}
                alt={name}
                className="w-3/5 h-3/5 object-contain"
                animate={{ scale: hovered ? 1.04 : 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            ) : (
              <motion.span
                className="text-zinc-900 text-2xl font-light tracking-[0.15em] uppercase text-center leading-tight"
                animate={{ scale: hovered ? 1.04 : 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {name}
              </motion.span>
            )}
          </div>

          {/* Hover overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 bg-zinc-950/85 flex flex-col justify-between p-5"
              >
                {/* Favorite button */}
                {isLoggedIn && (
                  <div className="flex justify-end">
                    <motion.button
                      onClick={toggleFavorite}
                      whileTap={{ scale: 0.85 }}
                      className="text-white/70 hover:text-white transition-colors"
                      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                    >
                      {favorited
                        ? <FaHeart size={14} className="text-white" />
                        : <FaRegHeart size={14} />
                      }
                    </motion.button>
                  </div>
                )}

                {/* Brand info */}
                <div className={!isLoggedIn ? "mt-auto" : ""}>
                  {category && (
                    <p className="text-[9px] font-medium tracking-[0.35em] uppercase text-zinc-500 mb-2">
                      {category}
                    </p>
                  )}
                  <p className="text-white text-sm font-light tracking-[0.1em] uppercase leading-tight mb-4">
                    {name}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-zinc-400">
                    <span className="w-4 h-px bg-zinc-400" />
                    View
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Below card — minimal label */}
        <div className="pt-2.5 pb-1">
          <p className="text-[11px] font-light tracking-[0.12em] uppercase text-zinc-400 truncate">
            {name}
          </p>
          {category && (
            <p className="text-[10px] tracking-[0.1em] text-zinc-700 truncate mt-0.5">
              {category}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
