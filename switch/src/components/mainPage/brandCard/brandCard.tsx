import Card from '@mui/material/Card';

interface BrandCardProps {
    brandName: string,
    style: string[]
};

const BrandCard = ( { brandName, style } : BrandCardProps ) => {
  return (
    <Card variant='outlined'>
      <div>{brandName}</div>
      <div>{style}</div>
    </Card>
  )
}

export default BrandCard;