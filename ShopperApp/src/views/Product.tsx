/*
#######################################################################
#
# Copyright (C) 2020-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/
import React from 'react';

import { ScreenSizeProvider } from '@/context/ScreenSize'
import { BottomBar } from './components/BottomBar';
import { ProductInformation } from './components/Product/ProductInformation';
import {TopBar} from './components/TopBar'
import Grid from '@mui/material/Grid';

import { Product } from '@/graphql/product/schema';
import {ProductImage} from './components/Product/ProductImage';
import { Divider, Typography, Box } from '@mui/material';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useRouter } from 'next/router';

import { LoginContext } from '../context/Login';

interface addToCartParams {
  id: string|string[]|undefined;
  quantity: number;
  loginContext: any;
  setError: React.Dispatch<React.SetStateAction<string>>;
  router: any;
}

const addToCart = ({id, quantity, loginContext, setError, router }: addToCartParams) => {
  const query = {
    query: `mutation addToCart {
      addToCart(productId: "${id}", quantity: ${quantity}) {
        id, quantity
      }
    }`}
  fetch('/api/graphql', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${loginContext.accessToken}`
    },
  })
    .then((res) => {
      return res.json()
    })
    .then(() => {
      setError('')
      router.push('/cart');
    })
    .catch((e) => {
      setError(e.toString())
    })
};

interface FetchProductParams {
  id: string|string[]|undefined;
  setProduct: React.Dispatch<React.SetStateAction<Product|undefined>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const fetchProduct = ({id, setProduct, setError }: FetchProductParams) => {
  const query = {
    query: `query GetProduct {
      productInfo(productId: "${id}") {
        id, name, description, price, rating, image
      }
    }`}
  fetch('/api/graphql', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res.json()
    })
    .then((json) => {
      setError('')
      setProduct(json.data.productInfo)
    })
    .catch((e) => {
      setError(e.toString())
      setProduct(undefined)
    })
};

interface ProductProps {
  id: string | string[] | undefined;
}

export function ProductView({id}: ProductProps) {
  const [product, setProduct] = React.useState<Product|undefined>(undefined);
  const [error, setError] = React.useState('')
  const loginContext = React.useContext(LoginContext);
  const [quantity, setQuantity] = React.useState('1');
  const router = useRouter();

  const handleChange = (event: SelectChangeEvent) => {
    setQuantity(event.target.value as string);
  };

  React.useEffect(() => {
    fetchProduct({id, setProduct, setError});
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      if (loginContext.accessToken.length < 1) {
        // Get the existing cart from localStorage or initialize an empty array
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Add the product to the cart
        let updatedCart;

        // Check if the product is already in the cart
        const existingCartItemIndex = cart.findIndex((item: any) => item.id === product.id);
        if (existingCartItemIndex !== -1) {
          cart[existingCartItemIndex].quantity += parseInt(quantity, 10);
          updatedCart = cart;
        } else {
          updatedCart = [...cart, {id: product.id, quantity: parseInt(quantity, 10)}];
        }
    
        // Update localStorage with the updated cart
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        router.push('/cart');
      } else {
        addToCart({id: product.id, quantity: parseInt(quantity, 10), loginContext, setError, router});
      }
    }
  };

  if (error !== '') {
    return (
      <Typography>
        {error}
      </Typography>
    )
  }

  return (
    <>
      <ScreenSizeProvider>
        <TopBar/>
        {product?
          <Box sx={{margin: '5vh 20vw 0 20vw'}}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item xs={8} sm={5} md={5}>
                <ProductImage image={product.image}/>
              </Grid>
              <Grid item xs={4} sm={4} md={4}>
                <ProductInformation name={product.name} description={product.description} price={product.price} /*rating={product.rating}*//>
              </Grid>
              <Grid item xs={12} sm={3} md={3}>
                {/*TODO: STYLIZE BUTTON ADD TO CART */}
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Quantity</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={quantity}
                    label="quantity"
                    onChange={handleChange}
                  >
                    <MenuItem value={1}>Quantity: 1</MenuItem>
                    <MenuItem value={2}>Quantity: 2</MenuItem>
                    <MenuItem value={3}>Quantity: 3</MenuItem>
                  </Select>
                </FormControl>
                <button onClick={handleAddToCart}>Add to Cart</button>
              </Grid>
            </Grid>
            <Divider/>
          </Box> :
          null
        }
        <BottomBar/>
      </ScreenSizeProvider>
    </>
  )
}