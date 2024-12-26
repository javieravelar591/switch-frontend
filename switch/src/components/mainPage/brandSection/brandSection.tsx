import BrandCard from '../brandCard';

const BrandSection = () => {
    const brandsList = [
        { name: 'supreme', style: ['streetwear', 'hypebeast'] }, 
        { name: 'bape', style: ['streetwear', 'hypebeast'] }
    ];
    
    return (
        <>
            {brandsList.map((brand) => {
                <BrandCard key={brand.name} brandName={brand.name} style={brand.style} />
            })}
        </>
    )
}

export default BrandSection