
interface BrandCardProps {
    brand: {
        id: number;
        name: string;
        description: string | null;
        logo_url: string | null;
    };
}

export default function BrandCard({ brand }: BrandCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center hover:scale-105 transition">
        {brand.logo_url && (
            <img
            src={brand.logo_url}
            alt={brand.name}
            className="h-24 w-24 object-contain mb-4"
            />
        )}
        <h2 className="font-semibold text-lg">{brand.name}</h2>
        <p className="text-sm text-gray-600 text-center mt-2 line-clamp-3">
            {brand.description}
        </p>
        </div>
    );
}