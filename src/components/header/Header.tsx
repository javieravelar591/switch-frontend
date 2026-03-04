"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, { credentials: "include" })
      .then((res) => setIsLoggedIn(res.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
      method: "POST",
      credentials: "include",
    });
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <header className="flex items-center w-full justify-between px-6 py-4 bg-[#0a0a0a] border-b border-zinc-800/60 sticky top-0 z-50">
      <Link href="/" className="text-lg font-bold text-white tracking-tight hover:opacity-80 transition-opacity">
        Switch
      </Link>

      <nav className="flex items-center gap-2">
        {!isLoggedIn && (
          <>
            <Link href="/signup" className="px-4 py-2 text-sm rounded-lg bg-white text-black font-medium hover:bg-zinc-100 transition-colors">
              Sign Up
            </Link>
            <Link href="/login" className="px-4 py-2 text-sm rounded-lg text-zinc-400 hover:text-white transition-colors">
              Log In
            </Link>
          </>
        )}

        {isLoggedIn && (
          <>
            <Link href="/favorites" className="px-4 py-2 text-sm rounded-lg text-zinc-400 hover:text-white transition-colors">
              Favorites
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm rounded-lg border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors"
            >
              Log Out
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
