import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Switch — Discover the brands that define culture",
    template: "%s | Switch",
  },
  description: "Explore 300+ streetwear, luxury, and artisanal brands. Favorite the ones you love and get personalized recommendations.",
  openGraph: {
    title: "Switch — Discover the brands that define culture",
    description: "Explore 300+ streetwear, luxury, and artisanal brands. Favorite the ones you love and get personalized recommendations.",
    type: "website",
    siteName: "Switch",
  },
  twitter: {
    card: "summary_large_image",
    title: "Switch — Discover the brands that define culture",
    description: "Explore 300+ streetwear, luxury, and artisanal brands.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
