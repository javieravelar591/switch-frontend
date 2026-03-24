"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedPage(props: P) {
    const { isLoggedIn, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isLoggedIn) {
        router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
      }
    }, [isLoggedIn, loading, router]);

    if (loading || !isLoggedIn) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      );
    }

    return <Component {...props} />;
  };
}
