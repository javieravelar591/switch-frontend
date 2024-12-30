import BrandCard from '@/components/brand-card';

const brands = [
  { id: 1, name: 'Nike', category: 'Sportswear', logo: '/placeholder.svg' },
  { id: 2, name: 'Apple', category: 'Technology', logo: '/placeholder.svg' },
  { id: 3, name: 'Coca-Cola', category: 'Beverages', logo: '/placeholder.svg' },
  // Add more brands as needed
]

export  function BrandSection() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
    </div>
  )
}

export default BrandSection;