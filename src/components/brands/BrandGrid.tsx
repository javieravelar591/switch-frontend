import BrandCard from "./BrandCard";

interface Brand {
  id: number;
  name: string;
  logo_url?: string;
  category?: string;
  tags?: string[];
  website?: string;
  // official_site?: string;
}

interface BrandGridProps {
  brands: Brand[];
}

export default function BrandGrid({ brands }: BrandGridProps) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-4 space-y-4 p-4">
      {brands.map((brand) => (
        <div key={brand.id} className="break-inside-avoid">
          <BrandCard
            name={brand.name}
            imageUrl={brand.logo_url}
            category={brand.category}
            tags={brand.tags}
            website={brand.website}
          />
        </div>
      ))}
    </div>
  );
}
