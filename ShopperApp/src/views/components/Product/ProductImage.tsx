import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';

interface ProductImageProps {
  images: string[];
}

export function ProductImage({images}: ProductImageProps) {
  const [currentImage, setCurrentImage] = React.useState(images[0]);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleThumbnailClick = (image: string) => {
    setCurrentImage(image);
  };

  return (
    <Grid container spacing={1}>
      {/* Thumbnails Grid on the Left */}
      <Grid item xs={3}>
        <Grid container spacing={1} sx={{ marginTop: '10px' }}>
          {images.map((image, index) => (
            <Grid item xs={12} key={index}>
              <CardMedia
                component="img"
                height="60vw"
                image={image}
                sx={styles.thumbnail}
                onClick={() => handleThumbnailClick(image)}
                aria-label={`thumbnail-${index}`}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Main Image Card on the Right */}
      <Grid item xs={9}>
        <Card>
          <CardMedia
            component="img"
            height="800vw"
            image={currentImage}
            sx={{
              ...styles.cardMedia,
              ...(isHovered && styles.cardMediaHovered),
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label='cardImage'
          />
        </Card>
      </Grid>
    </Grid>
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
  thumbnail: {
    cursor: 'pointer',
    objectFit: 'contain',
  },
};