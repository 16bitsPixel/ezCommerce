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
import { Divider, Box } from '@mui/material';

import { ProductPurchaseCard } from './components/Product/ProductPurchaseCard';

interface FetchProductParams {
  id: string|string[]|undefined;
  setProduct: React.Dispatch<React.SetStateAction<Product|undefined>>;
}

const fetchProduct = ({id, setProduct }: FetchProductParams) => {
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
      setProduct(json.data.productInfo)
    })
    .catch((e) => {
      alert(e.toString())
      setProduct(undefined)
    })
};

interface ProductProps {
  id: string | string[] | undefined;
}

export function ProductView({id}: ProductProps) {
  const [product, setProduct] = React.useState<Product|undefined>(undefined);

  React.useEffect(() => {
    fetchProduct({id, setProduct});
  }, []);

  return (
    <>
      <ScreenSizeProvider>
        <TopBar/>
        <Box style = {{backgroundColor: 'white', height: '100%', width: '100%'}}>
          {product?
            <Box sx={{margin: '5vh 10vw 0 10vw', backgroundColor: 'white'}}>
              <Grid container spacing={{ xs: 2, md: 5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={8} sm={5} md={5}>
                  <ProductImage images={product.image}/>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                  <ProductInformation name={product.name} description={product.description} price={product.price} /*rating={product.rating}*//>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <ProductPurchaseCard product={product} />
                </Grid>
              </Grid>
              <Divider style = {{marginTop: '5vh'}}/>
            </Box> :
            null
          }
        </Box>
        <BottomBar/>
      </ScreenSizeProvider>
    </>
  )
}