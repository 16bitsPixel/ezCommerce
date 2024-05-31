import React from 'react';
import { Box, Typography, Grid, Card, CardMedia} from '@mui/material';

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
  console.log(error);

  React.useEffect(() => {
    fetchProducts({setProducts, setError}, ids);
  }, [ids]);
  const newDate = new Date(date);
  const formattedDate = new Intl.DateTimeFormat('en-US').format(newDate);
  console.log(date);
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
      <Grid container spacing={2} sx={{ maxWidth: 'lg', width: '100%' }}>
        {products.map((product: Product, index) => (
          <Grid item xs={12} key={index}>
            <Card sx={{ display: 'flex', alignItems: 'center' }}>
              <CardMedia
                component="img"
                sx={{ width: 150, height: 150, objectFit: 'cover' }}
                image={product.image}
                alt={product.name}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: 2 }}>
                <Typography variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Status:</strong> {status}
                </Typography>
              </Box>
              <Box sx={{ padding: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Quantity:</strong> {quantity[index]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Price:</strong> ${product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Date:</strong> {formattedDate}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}