import React from 'react';
import { Box, Typography, Grid, Card,
  CardMedia, Button} from '@mui/material';

import {Product} from '../../../graphql/product/schema'
import { LoginContext } from '@/context/Login';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

interface OrderCardProps {
  ids: string[];
  status: string;
  quantity: number[];
  onTotalChange: (total: number) => void;
}

interface FetchProductsParams {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

interface addToCartParams {
  id: string|string[]|undefined;
  quantity: number;
  loginContext: any;
  setError: React.Dispatch<React.SetStateAction<string>>;
  router: any;
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

// id and quantity are both arrays
export function OrderCard({ ids, status, quantity, onTotalChange }: OrderCardProps) {
  const loginContext = React.useContext(LoginContext);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [error, setError] = React.useState('Logged Out');
  const { t } = useTranslation('common');
  const router = useRouter();

  const handleAddToCart = (product: string, quant: any) => {
    if (product) {
      if (loginContext.accessToken.length < 1) {
        // Get the existing cart from localStorage or initialize an empty array
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Add the product to the cart
        let updatedCart;

        // Check if the product is already in the cart
        const existingCartItemIndex = cart.findIndex((item: any) => item.id === product);
        if (existingCartItemIndex !== -1) {
          cart[existingCartItemIndex].quantity += parseInt(quant, 10);
          updatedCart = cart;
        } else {
          updatedCart = [...cart, {id: product, quantity: parseInt(quant, 10)}];
        }
    
        // Update localStorage with the updated cart
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        router.push('/cart');
      } else {
        addToCart({id: product, quantity: parseInt(quant, 10), loginContext, setError, router});
      }
    }
  };

  React.useEffect(() => {
    fetchProducts({ setProducts, setError }, ids);
  }, [ids]);

  React.useEffect(() => {
    if (products.length > 0) {
      const total = products.reduce((acc, product, index) => acc + product.price * quantity[index], 0);
      onTotalChange(total);
    }

  }, [products]);

  const handleViewItemClick = (id:string) => {
    router.push(`/product?id=${id}`);
  };

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
                  <strong>{t('status')}:</strong> {status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>{t('quantity')}:</strong> {quantity[index]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>{t('price')}:</strong> ${product.price}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Button 
                  className='orderButton' 
                  variant="contained" 
                  sx={{ minWidth: 160, paddingLeft: 2, paddingRight: 2, marginBottom: 1 }}
                  onClick= {()=>handleAddToCart(ids[index], quantity[index])}>
                  {t('buy-it-again')}
                </Button>
                <Button 
                  variant="outlined" 
                  sx={{ minWidth: 160, paddingLeft: 2, paddingRight: 2 }} 
                  onClick={() => handleViewItemClick(product.id)}>
                  {t('view-your-item')}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}