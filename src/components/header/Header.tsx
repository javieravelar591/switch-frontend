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

  return (
    <header className="flex items-center w-full justify-around px-8 py-4 bg-white shadow-sm dark:bg-black sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold hover:opacity-80 dark:text-white">
        Switch
      </Link>

      <nav className="flex items-center gap-6">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link href="/brands" className="hover:underline dark:text-gray-200">
            Brands
          </Link>
        </motion.div>

        {!isLoggedIn && (
          <>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link href="/signup" className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-80 dark:bg-white dark:text-black transition">
                Sign Up
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Link href="/login" className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-80 dark:bg-white dark:text-black transition">
                Log In
              </Link>
            </motion.div>
          </>
        )}

        {isLoggedIn && (
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/favorites" className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-80 dark:bg-white dark:text-black transition">
              Favorites
            </Link>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
