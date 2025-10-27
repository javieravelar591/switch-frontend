'use client'

import { useEffect, useState } from "react";
import BrandCard from "@/components/brands";
import { fetchBrands } from "@/lib/api";

export default function BrandsPage() {
    const [brands, setBrands] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      fetchBrands()
        .then((data) => setBrands(data))
        .catch((err) => setError(err.message));
    }, []);

    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div> 
    );
}