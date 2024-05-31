import React from 'react';
import { Box, Typography, Divider, 
  Grid, Card, CardMedia, CardContent } from '@mui/material';

import {Product} from '../../../graphql/product/schema'

interface OrderCardProps {
  ids: string[];
  date: Date;
  status: string;
  quantity: number[];
}

interface FetchProductsParams {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const fetchProducts = ({ setProducts, setError }: FetchProductsParams, ids: string[]) => {
  console.log('here');
  const fetchedProducts: any[] = [];
  const promises = ids.map((id) => {
    const variables = { productId: id };
    const query = {
      query: `query ProductInfo($productId: String!) {
        productInfo(productId: $productId) {
          id
          name
          price
          image
        }
      }`,
      variables, // Include variables in the query object
    };

    return fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setError('');
        fetchedProducts.push(json.data.productInfo);
        return json.data.productInfo;
      })
      .catch((e) => {
        setError(e.toString());
        setProducts([]);
      });
  });

  Promise.all(promises)
    .then(() => {
      setProducts(fetchedProducts);
    })
    .catch((e) => {
      setError(e.toString());
      setProducts([]);
    });
};

// id and quantity are both arrays
export function OrderCard({ids, date, status, quantity}: OrderCardProps) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [error, setError] = React.useState('Logged Out')

  React.useEffect(() => {
    fetchProducts({setProducts, setError}, ids);
  }, []);

  return (
    <div className="OrderDiv">
      <Grid container justifyContent="center" spacing={2}>
        {products.map((product: Product, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: ${product.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}