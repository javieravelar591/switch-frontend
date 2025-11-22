"use client";

import { useAnimate, stagger } from "framer-motion";
import { useEffect } from "react";

type Brand = {
  id: number;
  name: string;
  logo_url?: string | null;
  website?: string | null;
};

export default function Carousel({ brands }: { brands: Brand[] }) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (brands.length > 0) {
      animate(
        "div", // Target child divs
        { opacity: 1, y: 0 },
        {
          duration: 0.5,
          delay: stagger(0.05), // Slick stagger
          ease: "easeOut",
        }
      );
    }
  }, [brands, animate]);
  
  useEffect(() => {
    if (!scope.current) return;

    let animationFrame: number;
    const scrollSpeed = 0.5; // adjust this for faster/slower scroll

    const scroll = () => {
      if (!scope.current) return;

      scope.current.scrollLeft += scrollSpeed;

      // Reset when reaching the end
      if (
        scope.current.scrollLeft >=
        scope.current.scrollWidth - scope.current.clientWidth
      ) {
        scope.current.scrollLeft = 0;
      }

      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [scope]);


  return (
    <div ref={scope} className="flex space-x-4 overflow-x-auto py-4 no-scrollbar">
      {brands.slice(0, 10).map((brand) => (
        <div
          key={brand.id}
          className="flex-shrink-0 w-40 h-40 rounded-xl shadow-lg bg-white dark:bg-zinc-900 cursor-pointer opacity-0 translate-y-4 transition-all"
        >
          <a
            href={brand.website ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center h-full p-2"
          >
            {brand.logo_url ? (
              <img
                src={brand.logo_url}
                alt={brand.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <span className="text-lg font-semibold">{brand.name}</span>
            )}
          </a>
        </div>
      ))}
    </div>
  );
}
