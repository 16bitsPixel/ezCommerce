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
import Link from 'next/link';
import { Typography } from '@mui/material';

import { LoginContext } from '../context/Login';

interface addToCartParams {
  id: string|string[]|undefined;
  loginContext: any;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const addToCart = ({id, loginContext, setError }: addToCartParams) => {
  const query = {
    query: `query addToCart {
      addToCart(productId: "${id}") {
        id
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

  React.useEffect(() => {
    fetchProduct({id, setProduct, setError});
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      if (loginContext.accessToken.length < 1) {
        // Get the existing cart from localStorage or initialize an empty array
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Add the product to the cart
        const updatedCart = [...cart, {id: product.id}];
    
        // Update localStorage with the updated cart
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } else {
        addToCart({id: product.id, loginContext, setError});
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
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={8} sm={5} md={5}>
              <ProductImage image={product.image}/>
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
              <ProductInformation name={product.name} description={product.description} price={product.price} /*rating={product.rating}*//>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              {/*TODO: STYLIZE BUTTON ADD TO CART */}
              <Link href={`/cart`}>
                <button onClick={handleAddToCart}>Add to Cart</button>
              </Link>
            </Grid>
          </Grid> :
          null
        }
        <BottomBar/>
      </ScreenSizeProvider>
    </>
  )
}