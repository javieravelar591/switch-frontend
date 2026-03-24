"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiSearch, FiHeart, FiLogOut, FiShoppingBag } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => logout();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    window.location.href = q ? `/search?q=${encodeURIComponent(q)}` : "/";
  };

  const userInitial =
    user?.username?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-zinc-800/60">
      {/* Indigo accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="flex items-center w-full justify-between px-6 py-3 gap-4">
        <Link
          href="/"
          className="text-lg font-bold text-white tracking-tight hover:opacity-80 transition-opacity shrink-0"
        >
          Switch
        </Link>

        {/* Centered search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              size={14}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brands..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-colors"
            />
          </div>
        </form>

        <nav className="flex items-center gap-2 shrink-0">
          {!isLoggedIn && (
            <>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm rounded-lg bg-white text-black font-medium hover:bg-zinc-100 transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                Log In
              </Link>
            </>
          )}

          {isLoggedIn && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((v) => !v)}
                className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold hover:bg-indigo-500 transition-colors"
              >
                {userInitial}
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden"
                  >
                    <Link
                      href="/chat"
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FiShoppingBag size={14} /> Personal Shopper
                    </Link>
                    <Link
                      href="/favorites"
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors border-t border-zinc-800"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FiHeart size={14} /> Favorites
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors border-t border-zinc-800"
                    >
                      <FiLogOut size={14} /> Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
