import Image from "next/image";

interface BrandCardProps {
  name: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  website?: string;
//   official_site?: string;
}

export default function BrandCard({ name, imageUrl, category, tags, website }: BrandCardProps) {
  console.log(`https://cdn.brandfetch.io/${name}?c=1id0pRpwlGyD1TTIOUw`);
  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer max-w-9/10"
      onClick={() => website && window.open(website, "_blank")}
    >
      {imageUrl ? (
        <Image
          src={`https://cdn.brandfetch.io/${name}?c=1id0pRpwlGyD1TTIOUw`}
          alt={name}
          width={400}
          height={400}
          className="object-cover w-full h-56"
        />
      ) : (
        <div className="bg-gray-100 flex items-center justify-center w-full h-56">
          <span className="text-gray-400 text-sm">No Image</span>
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
        {category && (
          <p className="text-sm text-gray-500 mt-1 capitalize">{category}</p>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            <span>{tags}</span>
          </div>
        )}
      </div>
    </div>
  );
}
