import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, Box, CardActions } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const styles = {
  cardMedia: {
    objectFit: 'contain',
    transition: 'transform 0.3s ease-in-out',
  },
  cardMediaHovered: {
    transform: 'scale(1.1)', // Adjust the scale factor as needed
  },
};

export default function ProductCard({name, price, rating, image}: any) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const stars = Array.from({ length: rating }, (_, index) => (
    <StarIcon key={index} />
  ));
  
  return (
    <Card sx={{ maxWidth: 250 }}>
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
      />
      <CardContent>
      <Typography sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }} component="div">
          {name}
        </Typography>
      </CardContent>
      <CardActions style={{flexDirection: 'column', alignItems: 'flex-start'}}>
        <Box>{stars}</Box>
        <Typography variant="h6" color="text.primary">
          ${price}
        </Typography>
      </CardActions>
    </Card>
  );
}