"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export const LoginModal = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const message = await res.json();
        throw new Error(message.detail || "Login failed");
      }

      const raw = typeof router.query.redirect === "string" ? router.query.redirect : "/";
      const redirect = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
      window.location.href = redirect;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-white tracking-tight hover:opacity-80 transition">
            Switch
          </Link>
          <p className="text-zinc-400 mt-2 text-sm">Welcome back</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-500 transition"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-500 transition"
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-400 text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2 py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log In"}
            </motion.button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-zinc-500 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginModal;