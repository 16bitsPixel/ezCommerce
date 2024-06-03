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

/*
  COLOR PALETTE: https://coolors.co/palette/03045e-0077b6-00b4d8-90e0ef-caf0f8
*/

import React from 'react';

import { Product } from '@/graphql/product/schema';
import {Typography, Button, Card, Divider } from '@mui/material';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from 'next-i18next';

import { useRouter } from 'next/router';

import { LoginContext } from '../../../context/Login';

interface addToCartParams {
  id: string|string[]|undefined;
  quantity: number;
  loginContext: any;
  setError: React.Dispatch<React.SetStateAction<string>>;
  router: any;
}

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

interface addToWishlistParams {
  product: any;
  loginContext: any;
  setError: React.Dispatch<React.SetStateAction<string>>;
  router: any;
}

const addToWishlist = ({product, loginContext, setError, router }: addToWishlistParams) => {
  const productInput = {
    Productname: product.name,
    Productid: product.id,
    description: JSON.stringify(product.description),
    price: product.price,
    rating: product.rating,
    image: JSON.stringify(product.image)
  };

  console.log(productInput);

  const query = {
    query: `
      mutation addWishList {
        addWishList(input: {
          Productname: "${productInput.Productname}",
          Productid: "${productInput.Productid}",
          description: ${productInput.description},
          price: ${productInput.price},
          rating: ${productInput.rating},
          image: ${productInput.image}
        }) {
          id
        }
      }
    `
  };
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

interface ProductPurchaseCardProps {
  product: Product
}

export function ProductPurchaseCard({product}: ProductPurchaseCardProps) {
  const [error, setError] = React.useState('')
  const loginContext = React.useContext(LoginContext);
  const [quantity, setQuantity] = React.useState('1');
  const router = useRouter();
  const { t } = useTranslation('common');
  

  const handleChange = (event: SelectChangeEvent) => {
    setQuantity(event.target.value as string);
  };

  const handleAddToCart = () => {
    if (product) {
      if (loginContext.accessToken.length < 1) {
        // Get the existing cart from localStorage or initialize an empty array
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Add the product to the cart
        let updatedCart;

        // Check if the product is already in the cart
        const existingCartItemIndex = cart.findIndex((item: any) => item.id === product.id);
        if (existingCartItemIndex !== -1) {
          cart[existingCartItemIndex].quantity += parseInt(quantity, 10);
          updatedCart = cart;
        } else {
          updatedCart = [...cart, {id: product.id, quantity: parseInt(quantity, 10)}];
        }
    
        // Update localStorage with the updated cart
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        router.push('/cart');
      } else {
        addToCart({id: product.id, quantity: parseInt(quantity, 10), loginContext, setError, router});
      }
    }
  };

  const handleAddWishlist = () => {
    if (product) {
      if (loginContext.accessToken.length < 1) {
        // route to login page
        router.push('/login');

        // after user success login, redirect back to this product page
      } else {
        addToWishlist({product, loginContext, setError, router});
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Card style={{ height: '80%', width: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          ${product.price}
        </Typography>

        <Typography variant="h5" gutterBottom style = {{color: 'green'}}>
          {/* TODO: implement quantity */}
          {t("inStock")}
        </Typography>

        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="quantity-label">{t("quantity")}</InputLabel>
          <Select
            labelId="quantity-label"
            id="quantity"
            value={quantity}
            onChange={handleChange}
            aria-label="quantitySelect"
            label="Quantity"
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

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddToCart} 
          aria-label="addToCartBtn"
          style={{ marginTop: '20px', width: '90%', height: '3.5vh', borderRadius: '25px', backgroundColor: '#FFD814', alignSelf: 'center', color: 'black' }}
        >
          {t("addCart")}
        </Button>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddWishlist} 
          style={{ marginTop: '20px', width: '90%', height: '3.5vh', borderRadius: '25px', backgroundColor: '#ff9900', alignSelf: 'center', color: 'black' }}
        >
          {/*TODO: buy now */}
          {t("addList")}
        </Button>

        <Divider style = {{marginTop: '20px'}}/>

        <Typography gutterBottom style = {{color: '#03045e', marginTop: '2vh'}}>
          {t("soldBy")}
        </Typography>
      </Card>
    </div>
  );
}