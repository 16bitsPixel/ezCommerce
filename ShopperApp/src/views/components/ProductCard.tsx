import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {CardActions} from '@mui/material';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  //rating: number;
  image: string;
}

export default function ProductCard({id, name, price, /*rating,*/ image}: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  return (
    <Card>
      <Link href={`/product?id=${id}`}>
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={name}
          sx={{
            ...styles.cardMedia,
            ...(isHovered && styles.cardMediaHovered),
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label={`cardImage-${id}`}
        />
      </Link>
      <CardContent>
        <Typography sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }} component="div">
          {name}
        </Typography>
      </CardContent>
      <CardActions style={{flexDirection: 'column', alignItems: 'flex-start'}}>
        <Typography variant="h6" color="text.primary">
          ${price}
        </Typography>
      </CardActions>
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