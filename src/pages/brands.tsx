'use client'

import { useEffect, useState } from "react";
import { fetchBrands } from "@/lib/api";
import BrandGrid from "@/components/brands/BrandGrid";

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
      <div>
        <BrandGrid brands={brands} />
      </div> 
    );
}