"use client";

import Link from "next/link";
import { FiMail, FiTwitter, FiInstagram, FiArrowRight } from "react-icons/fi";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-800/60 bg-[#0a0a0a] mt-auto">

      {/* ── Brand submission callout ─────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-16 border-b border-zinc-800/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">

          <div className="max-w-xl">
            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-zinc-600 mb-5">
              Submit a Brand
            </p>
            <h2
              className="text-4xl md:text-5xl font-light text-white leading-tight tracking-tight mb-4"
              style={{ fontFamily: "var(--font-editorial)" }}
            >
              Not seeing your favorite brand?
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
              We're always expanding the platform. If there's a brand you think belongs here —
              streetwear, luxury, artisanal, or anything in between — we want to hear about it.
            </p>
          </div>

          <a
            href="mailto:contact@switch.app?subject=Brand%20Suggestion"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-zinc-900 border border-zinc-700 rounded-full text-white text-sm font-medium hover:bg-zinc-800 hover:border-zinc-500 transition-all duration-200 group whitespace-nowrap self-start md:self-auto cursor-pointer"
          >
            <FiMail size={13} className="text-zinc-400 group-hover:text-white transition-colors" />
            Suggest a Brand
            <FiArrowRight size={13} className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
          </a>

        </div>
      </div>

      {/* ── Footer columns ───────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-white font-bold text-lg tracking-tight hover:opacity-75 transition-opacity"
            >
              Switch
            </Link>
            <p className="text-zinc-600 text-xs leading-relaxed mt-3 max-w-[180px]">
              The brands that define culture, inspire style, and shape identity.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-zinc-600 mb-5">
              Explore
            </p>
            <ul className="flex flex-col gap-3.5">
              {[
                { label: "All Brands", href: "/" },
                { label: "Favorites", href: "/favorites" },
                { label: "Streetwear", href: "/" },
                { label: "Luxury", href: "/" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-zinc-500 text-[13px] hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-zinc-600 mb-5">
              Account
            </p>
            <ul className="flex flex-col gap-3.5">
              {[
                { label: "Sign Up", href: "/signup" },
                { label: "Log In", href: "/login" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-zinc-500 text-[13px] hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-zinc-600 mb-5">
              Connect
            </p>
            <ul className="flex flex-col gap-3.5">
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-zinc-500 text-[13px] hover:text-white transition-colors duration-200"
                >
                  <FiTwitter size={12} />
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-zinc-500 text-[13px] hover:text-white transition-colors duration-200"
                >
                  <FiInstagram size={12} />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@switch.app"
                  className="inline-flex items-center gap-2 text-zinc-500 text-[13px] hover:text-white transition-colors duration-200"
                >
                  <FiMail size={12} />
                  contact@switch.app
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────── */}
      <div className="border-t border-zinc-800/40">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-zinc-700">
            © {year} Switch. Made for those who care about culture.
          </p>
          <p className="text-[11px] text-zinc-800 tracking-widest uppercase">
            Streetwear · Luxury · Artisanal
          </p>
        </div>
      </div>

    </footer>
  );
}
