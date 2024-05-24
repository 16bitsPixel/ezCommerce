/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {List, Typography, Box} from '@mui/material';
import { Product } from '../../../graphql/product/schema'
import { CartItem } from '@/graphql/cart/schema';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Button } from '@mui/base';
import { LoginContext } from '../../../context/Login';
import { ProductContext } from '@/context/Product';

// TODO: fetch account cart from endpoint
interface FetchCartParams {
  setCart: React.Dispatch<React.SetStateAction<CartItem|undefined>>;
  loginContext: any;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const fetchCart = ({ setCart, loginContext, setError }: FetchCartParams) => {
  const query = {
    query: `query GetCart {
      Cart {
        id
      }
    }`
  };

  fetch('/api/graphql', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${loginContext.accessToken}`
    },
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.errors) {
        setError(json.errors[0].message);
        setCart(undefined);
      } else {
        setError('');
        setCart(json.data.Cart);
      }
    })
    .catch((e) => {
      setError(e.toString());
      setCart(undefined);
    });
};

interface FetchProductParams {
  id: string|string[]|undefined;
  setProduct: React.Dispatch<React.SetStateAction<Product|undefined>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const fetchProduct = ({ id, setProduct, setError }: FetchProductParams) => {
  const query = {
    query: `query GetProduct {
      productInfo(productId: "${id}") {
        id, name, description, price, rating, image
      }
    }`
  };

  fetch('/api/graphql', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.errors) {
        setError(json.errors[0].message);
        setProduct(undefined);
      } else {
        setError('');
        setProduct(json.data.productInfo);
      }
    })
    .catch((e) => {
      setError(e.toString());
      setProduct(undefined);
    });
};

/**
 * Workspace drawer
 * @return {JSX}
 */
export function CartList() {
  const {products, setProducts, cart, setCart} = React.useContext(ProductContext)
  const [error, setError] = React.useState('');
  const loginContext = React.useContext(LoginContext)

  React.useEffect(() => {
    if (loginContext.accessToken.length < 1) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } else {
      // TODO: fetch account cart from endpoint
        fetchCart({setCart, loginContext, setError});
    }
  }, []);

  React.useEffect(() => {
    const loadProducts = async () => {
      const productPromises = cart.map((productId: CartItem) =>
        new Promise((resolve) => {
          fetchProduct({
            id: productId.id,
            setProduct: (product) => resolve(product),
            setError: (err) => setError(err),
          });
        })
      );

      const productResults = await Promise.all(productPromises);
      setProducts(productResults.filter((product) => product !== undefined));
    };

    loadProducts();
  }, [cart]);

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
        {products.map((item: Product, index: number) => (
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
