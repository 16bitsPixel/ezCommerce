import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

interface ProductImageProps {
  image: string;
}

export function ProductImage({image}: ProductImageProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  return (
    <Card>
      <CardMedia
        component="img"
        height="800vw"
        image={image}
        sx={{
          ...styles.cardMedia,
          ...(isHovered && styles.cardMediaHovered),
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label='cardImage'
      />
    </Card>
  );
}

const styles = {
  cardMedia: {
    objectFit: 'contain',
    transition: 'transform 0.3s ease-in-out',
  },
  cardMediaHovered: {
    transform: 'scale(1.1)', // Adjust the scale factor as needed
  },
};