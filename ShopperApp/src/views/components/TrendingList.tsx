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

import { LoginContext } from '../../context/Login'
import { Product } from '../../graphql/product/schema'
import ProductCard from './ProductCard';
import { Box } from '@mui/material';

interface FetchProductsParams {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  accessToken: string;
}

const fetchProducts = ({ setProducts, setError, accessToken }: FetchProductsParams) => {
  const query = {query: `query product {product {id, name, price, rating, image}}`}
  fetch('/api/graphql', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res.json()
    })
    .then((json) => {
      if (json.errors) {
        setError(`${json.errors[0].message}`)
        setProducts([])
      } else {
        setError('')
        setProducts(json.data.product)
      }
    })
    .catch((e) => {
      setError(e.toString())
      setProducts([])
    })
};

export function TrendingList() {
  const loginContext = React.useContext(LoginContext)
  const [products, setProducts] = React.useState<Product[]>([]);
  const [error, setError] = React.useState('Logged Out')

  console.log(error);

  React.useEffect(() => {
    fetchProducts({setProducts, setError, accessToken: loginContext.accessToken});
  }, [loginContext.accessToken]);

  return (
    <Box>
      {products.map((product: Product) => (
        <ProductCard key = {product.id} name={product.name} price={product.price} rating={product.rating} image={product.image}/>
      ))}
    </Box>
  )
}
