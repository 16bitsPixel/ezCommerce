/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {List, Typography, Box, CardContent, Link} from '@mui/material';
import { Product } from '../../../graphql/product/schema'
import { CartItem } from '@/graphql/cart/schema';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { LoginContext } from '../../../context/Login';
import { ProductContext } from '@/context/Product';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface FetchCartParams {
  setCart: React.Dispatch<React.SetStateAction<CartItem|undefined>>;
  loginContext: any;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const fetchCart = ({ setCart, loginContext, setError }: FetchCartParams) => {
  const query = {
    query: `query GetCart {
      Cart {
        id, quantity
      }
    }`
  };

  fetch('/api/graphql', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${loginContext.accessToken}`
    },
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.errors) {
        setError(json.errors[0].message);
        setCart(undefined);
      } else {
        setError('');
        setCart(json.data.Cart);
      }
    })
    .catch((e) => {
      setError(e.toString());
      setCart(undefined);
    });
};

interface FetchProductParams {
  id: string|string[]|undefined;
  setProduct: React.Dispatch<React.SetStateAction<Product|undefined>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const fetchProduct = ({ id, setProduct, setError }: FetchProductParams) => {
  const query = {
    query: `query GetProduct {
      productInfo(productId: "${id}") {
        id, name, description, price, rating, image
      }
    }`
  };

  fetch('/api/graphql', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.errors) {
        setError(json.errors[0].message);
        setProduct(undefined);
      } else {
        setError('');
        setProduct(json.data.productInfo);
      }
    })
    .catch((e) => {
      setError(e.toString());
      setProduct(undefined);
    });
};

interface DeleteCartItemParams {
  newCart: CartItem[];
  loginContext: any;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const deleteCartItem = ({ newCart, loginContext, setError }: DeleteCartItemParams) => {
  const query = {
    query: `mutation DeleteCartItem {
      setCart(newCart: ${JSON.stringify(newCart)}) {
        id, quantity
      }
    }`
  };

  fetch('/api/graphql', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${loginContext.accessToken}`
    },
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.errors) {
        setError(json.errors[0].message);
      } else {
        setError('');
      }
    })
    .catch((e) => {
      setError(e.toString());
    });
};

/**
 * Workspace drawer
 * @return {JSX}
 */
export function CartList() {
  const {products, setProducts, cart, setCart} = React.useContext(ProductContext)
  const [error, setError] = React.useState('');
  const loginContext = React.useContext(LoginContext)

  React.useEffect(() => {
    if (loginContext.accessToken.length < 1) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } else {
      // TODO: fetch account cart from endpoint
      fetchCart({setCart, loginContext, setError});
    }
  }, []); // eslint-disable-line

  React.useEffect(() => {
    const loadProducts = async () => {
      const productPromises = cart.map((productId: CartItem) =>
        new Promise((resolve) => {
          fetchProduct({
            id: productId.id,
            setProduct: (product) => resolve(product),
            setError: (err) => setError(err),
          });
        })
      );

      const productResults = await Promise.all(productPromises);
      setProducts(productResults.filter((product) => product !== undefined));
    };

    loadProducts();
  }, [cart]); // eslint-disable-line

  const handleDeleteItem = (index: number) => {
    // Create a copy of the cart
    const updatedCart = [...cart];

    // Remove the item at the specified index
    updatedCart.splice(index, 1);

    setCart(updatedCart);
    if (loginContext.accessToken.length < 1) {
      // if not logged in
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      // if logged in then set cart endpoint
      deleteCartItem({newCart: updatedCart, loginContext, setError});
    }
  };

  // Function to handle quantity change
  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedCart = [...cart];
    (updatedCart[index] as CartItem).quantity = quantity;
    setCart(updatedCart);
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    for (const item of products) {
      const cartItem = cart.find((cartItem) => (cartItem as CartItem).id === (item as Product).id);
      if (cartItem) {
        totalPrice += (item as Product).price * (cartItem as CartItem).quantity;
      }
    }
    return totalPrice;
  };

  const totalPrice = calculateTotalPrice();

  // TODO: FIX IMAGE SIZING AND GRID SIZING
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
      <List>
        {products.map((item: Product, index) => (
          <Card key={index} style={{ display: 'flex', marginBottom: '16px', padding: '16px', alignItems: 'center', minHeight: '15vh' }}>
            <Grid container spacing={2}>
              <Grid item xs={3} sm={3} md={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Link href={`/product?id=${item.id}`}>
                  <CardMedia
                    component="img"
                    image={item.image[0]}
                    alt={item.name}
                    aria-label="cardImage"
                    style={{ height: 'auto', maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }}
                  />
                </Link>
              </Grid>
              <Grid item xs={6} sm={7} md={8}>
                <CardContent>
                  <Typography variant="h6" component="a" style={{ color: 'black' }}>
                    {item.name}
                  </Typography>

                  {/* TODO: change based on quantity */}
                  <Typography variant="body2" color="green">In Stock</Typography>

                  {/* TODO: change to return status */}
                  <Typography variant="body2" color="#007bff">Return</Typography>

                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <FormControl variant="outlined" margin="normal" style={{ minWidth: '80px' }}>
                        <InputLabel id="quantity-label">Qty</InputLabel>
                        <Select
                          labelId={`quantity-label-${index}`}
                          id={`quantity-${index}`}
                          value={cart[index] ? (cart[index] as CartItem).quantity : 1} // Set the value to the quantity from cart
                          onChange={(event) => handleQuantityChange(index, event.target.value as number)}
                          label="Qty"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200, // Adjust the maxHeight as needed
                              },
                            },
                          }}
                        >
                          {[...Array(30).keys()].map((num) => (
                            <MenuItem key={num + 1} value={num + 1}>
                              {num + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => handleDeleteItem(index)}
                        style={{ marginTop: '10px', cursor: 'pointer', color: '#007bff' }}
                        underline="none"
                      >
                        Delete
                      </Link>
                    </Grid>
                  </Grid>
                </CardContent>
              </Grid>

              <Grid item xs={2} sm={2} md={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', padding: 10 }}>
                <Typography variant="h6" style = {{fontWeight: 'bold'}}>${item.price}</Typography>
              </Grid>
            </Grid>
          </Card>
        ))}
      </List>
      <Typography variant="h5" style={{ marginTop: '16px', textAlign: 'right', paddingRight: '20px', paddingBottom: '20px', fontWeight: 'bold' }}>
        Total: ${totalPrice.toFixed(2)}
      </Typography>
    </Box>
  );
}

/*
<Grid container spacing={{ xs: 2, sm: 4, md: 6 }} key={index}>
            <Grid item xs={3} sm={3} md={2}>
              <Card>
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.name}
                  aria-label='cardImage'
                  style={{height:'auto', maxWidth: '180px'}}
                />
              </Card>
            </Grid>
            <Grid item xs={6} sm={7} md={8}>
              <Typography>
                {item.name}
              </Typography>
              <Button onClick={() => handleDeleteItem(index)}>
                Delete
              </Button>
            </Grid>
            <Grid item xs={1} sm={1} md={1}>
              <Typography variant="h6">
              ${item.price}
              </Typography>
            </Grid>
          </Grid>
*/