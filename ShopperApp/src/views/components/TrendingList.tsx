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

const fetchProducts = (setProducts: Function, setError: Function, accessToken: string) => {
  const query = {query: `query product {product {name, price, rating, image}}`}
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
        console.log(json);
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
  const [products, setProducts] = React.useState([])
  const [error, setError] = React.useState('Logged Out')

  React.useEffect(() => {
    fetchProducts(setProducts, setError, loginContext.accessToken);
  }, [loginContext.accessToken]);

  if (loginContext.accessToken.length > 0) {
    return (
      <div>
        {products.map((product: Product) => (
          <ProductCard name={product.name} price={product.price} rating={product.rating} image={product.image}/>
        ))}
      </div>
    )
  }
  else {
    return null
  }
}
