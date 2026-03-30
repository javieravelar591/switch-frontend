"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/login?redirect=/onboarding");
      } else {
        const data = await res.json();
        setError(data.detail || "Error creating user");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <Head>
      <title>Sign Up | Switch</title>
      <meta name="description" content="Join Switch to discover and save your favorite streetwear, luxury, and artisanal brands." />
    </Head>
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
          <p className="text-zinc-400 mt-2 text-sm">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-500 transition"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Username</label>
              <input
                type="text"
                placeholder="yourname"
                className="px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-500 transition"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-500 transition"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                minLength={8}
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
              {loading ? "Creating account..." : "Sign Up"}
            </motion.button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-zinc-500 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
    </>
  );
}
