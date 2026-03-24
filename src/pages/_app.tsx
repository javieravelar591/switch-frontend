import "@/app/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Header from "@/components/header/Header";
import ChatFAB from "@/components/ui/ChatFAB";
import { AuthProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:site_name" content="Switch" />
        <meta name="twitter:card" content="summary" />
      </Head>
      <Header />
      <Component {...pageProps} />
      <ChatFAB />
    </AuthProvider>
  );
}
