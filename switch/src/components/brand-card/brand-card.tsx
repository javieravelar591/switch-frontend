import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

interface Brand {
    id: number
    name: string
    category: string
    logo: string
}

interface BrandCardProps {
    brand: Brand
}

export function BrandCard({ brand }: BrandCardProps) {
    return (
        <Link href={`/brand/${brand.id}`}>
            <Card className="overflow-hidden">
                <CardContent className="p-4">
                    <div className="aspect-square relative mb-4">
                        <Image
                            src={brand.logo}
                            alt={`${brand.name} logo`}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h2 className="text-lg font-semibold">{brand.name}</h2>
                </CardContent>
                <CardFooter className="bg-muted">
                    <p className="text-sm text-muted-foreground">{brand.category}</p>
                </CardFooter>
            </Card>
        </Link>
    )
}

export default BrandCard;