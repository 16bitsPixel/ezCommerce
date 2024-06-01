import { ProductContext } from "@/context/Product";
import React, { useContext } from "react";
import { useTranslation } from 'next-i18next';
import { LoginContext } from "@/context/Login";
import { Product } from "@/graphql/product/schema";
import { useRouter } from 'next/router';
import { Button } from "@mui/material";

export function CheckoutButton (){

  const {t} = useTranslation('common')
  const {products, setCart, setProducts} = React.useContext(ProductContext)
  const router = useRouter();
  const { id: account_id, accessToken } = useContext(LoginContext);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (account_id.length > 0) {
      try {

        const response = await fetch('/api/checkout_sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(products),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response from server:', errorText);
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();

        if (data.url) {
            localStorage.setItem('loginInfo', accessToken);
            window.location.href = data.url;
        }
                    
        const productMap = new Map<string, number>();
        for (const product of products) {
          const productId = (product as Product).id;
          const quantity = 1;
          if (productMap.has(productId)) {
            productMap.set(productId, productMap.get(productId)! + quantity);
          } else {
            productMap.set(productId, quantity);
          }
        }
        const inputOrder = {
          account_id,
          product_id: Array.from(productMap.keys()),
          quantities: Array.from(productMap.values()),
        };
    
        
        const orderResponse = await fetch('http://localhost:3015/api/v0/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputOrder)
        });
        
        if (!orderResponse.ok) {
          const errorText = await orderResponse.text();
          console.error('Error response from server:', errorText);
          throw new Error('Network response was not ok');
        }
        
        setCart([]);
        setProducts([]);
        localStorage.removeItem('cart');
    

      } catch (error) {
        console.error('Fetch error:', error);
      }
    } else {
      router.push('/login');
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <section>
        <Button type="submit" role="link" aria-label='checkout-button' variant="contained">
          {t('proceed-to-checkout')}
        </Button>
      </section>
    </form>
  );
}
