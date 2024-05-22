import React from 'react';
import {List, Typography, Box} from '@mui/material';
import { Product } from '../../../graphql/product/schema'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Button } from '@mui/base';

/**
 * Workspace drawer
 * @return {JSX}
 */
export function CartList() {
  const [cart, setCart] = React.useState<any>([]);

  React.useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleDeleteItem = (index: number) => {
    // Create a copy of the cart
    const updatedCart = [...cart];
    // Remove the item at the specified index
    updatedCart.splice(index, 1);
    // Update state and localStorage
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // TODO: FIX IMAGE SIZING AND GRID SIZING
  return (
    <Box style={{display: 'flex', flexDirection: 'column' }}>
      <List>
        {cart.map((item: Product, index: number) => (
          <Grid container spacing={{ xs: 2, sm: 4, md: 6 }} key={index}>
            <Grid item xs={3} sm={3} md={2}>
              <Card>
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.name}
                  aria-label='cardImage'
                  style={{height:'auto', maxWidth: '180px'}}
                />
              </Card>
            </Grid>
            <Grid item xs={6} sm={7} md={8}>
              <Typography>
                {item.name}
              </Typography>
              <Button onClick={() => handleDeleteItem(index)}>
              Delete
              </Button>
            </Grid>
            <Grid item xs={1} sm={1} md={1}>
              <Typography variant="h6">
              ${item.price}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </List>
    </Box>
  );
}
