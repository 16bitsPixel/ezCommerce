import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, Divider, Button} from '@mui/material';

import {Product} from '../../../graphql/product/schema'

interface OrderCardProps {
  ids: string[];
  status: string;
  quantity: number[];
}

interface FetchProductsParams {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const fetchProducts = ({ setProducts, setError }: FetchProductsParams, ids: string[]) => {
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
export function OrderCard({ ids, status, quantity }: OrderCardProps) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [error, setError] = React.useState('Logged Out');
  console.log(error);

  React.useEffect(() => {
    fetchProducts({ setProducts, setError }, ids);
  }, [ids]);

  // const newDate = new Date(date);
  // const formattedDate = new Intl.DateTimeFormat('en-US').format(newDate);
  // console.log(date);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
      <Grid container spacing={2} sx={{ width: '100%' }}>
        {products.map((product: Product, index) => (
          <Grid item xs={12} key={index}>
            <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', paddingRight: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 75, height: 75, objectFit: 'contain' }}
                  image={product.image[0]}
                  alt={product.name}
                />
              </Box>
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Status:</strong> {status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Quantity:</strong> {quantity[index]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Price:</strong> ${product.price}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Button className='orderButton' variant="contained">
                  Buy it again
                </Button>
                <Button variant="outlined">View your item</Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}