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
      console.log(json);
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
  const [cart, setCart] = React.useState<Product[]>([]);
  const [error, setError] = React.useState('Logged Out')

  React.useEffect(() => {
    fetchProduct({id, setProduct, setError});
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      // Add the product to the cart
      const updatedCart = [...cart, product];
      setCart(updatedCart);
      // Update localStorage with the updated cart
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

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
                <ProductInformation name={product.name} description={product.description} price={product.price} rating={product.rating}/>
              </Grid>
              <Grid item xs={12} sm={3} md={3}>
                {/*TODO: STYLIZE BUTTON ADD TO CART */}
                <Link href={`/order`}>
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