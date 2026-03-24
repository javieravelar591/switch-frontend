"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingBag } from "react-icons/fi";
import { useState } from "react";

export default function ChatFAB() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);

  if (pathname === "/chat") return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end">
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.15 }}
            className="mr-3 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 whitespace-nowrap shadow-lg"
          >
            Personal Shopper
          </motion.span>
        )}
      </AnimatePresence>

      <Link href="/chat">
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-900/40 transition-colors cursor-pointer"
          aria-label="Open personal shopper"
        >
          <FiShoppingBag size={22} className="text-white" />
        </motion.div>
      </Link>
    </div>
  );
}
