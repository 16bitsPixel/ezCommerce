import { ProductContext } from "@/context/Product";
import React, { useContext } from "react";
import { useTranslation } from 'next-i18next';
import { LoginContext } from "@/context/Login";
import { useRouter } from 'next/router';
import { Button } from "@mui/material";

interface CartItem {
    id: string;
    quantity: number;
  }

export interface OrderItem {
    account_id: string;
    product_id: string;
    quantities: number;
  }
  
export interface InputOrder {
    items: OrderItem[];
  }

export function CheckoutButton (){

  const {t} = useTranslation('common')
  const {products,cart, setCart, setProducts} = React.useContext(ProductContext)
  const router = useRouter();
  const { id: account_id, accessToken } = useContext(LoginContext);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (account_id.length > 0) {
      try {


        // Clear cart
        const newCart: never[] = []
        const query2 = {
          query: `mutation DeleteCartItem {
          setCart(newCart: ${JSON.stringify(newCart)}) {
            id, quantity
          }
        }`
        };

        fetch('/api/graphql', {
          method: 'POST',
          body: JSON.stringify(query2),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.errors) {
              console.log("Error: ", json.errors)
            }
          })
          .catch((e) => {
            console.log("Caught Error: ", e)
          });


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

        const inputOrder = cart.map((item:CartItem) => ({
          account_id: account_id,
          product_id: item.id,
          quantities: item.quantity
        }));
  
        const orderInput: InputOrder = {
          items: inputOrder,
        };
        
        const orderResponse = await fetch('http://localhost:3015/api/v0/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderInput)
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
      <section style = {{margin: 15}}>
        <Button type="submit" role="link" aria-label='checkout-button' variant="contained">
          {t('proceed-to-checkout')}
        </Button>
      </section>
    </form>
  );
}
