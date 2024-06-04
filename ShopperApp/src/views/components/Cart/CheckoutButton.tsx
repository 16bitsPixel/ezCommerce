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
  interface Product {
    id: string;
    name: string;
    description: string[];
    price: number;
    rating: number;
    image: string[];
  }

export interface StripeInput {
    product_id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }
  

export function CheckoutButton (){

  const {t} = useTranslation('common')
  const {products,cart, setCart, setProducts} = React.useContext(ProductContext)
  const router = useRouter();
  const { id: account_id, accessToken } = useContext(LoginContext);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(`Form submitted and acount id is ${account_id.length}`);

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

        await fetch('/api/graphql', {
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
        console.log("About to call add to order")
        const query3 = {
          query: `
              mutation CreateOrder($input: InputOrder!) {
                createOrder(input: $input) {
                  account_id
                  product_id
                  quantities
                }
              }
            `,
          variables: {
            input: {
              account_id: account_id,
              product_id: cart.map((item:CartItem) => item.id),
              quantities: cart.map((item:CartItem)=> item.quantity)
            }
          }
        };
          
        console.log(query3);
          
        await fetch('/api/graphql', {
          method: 'POST',
          body: JSON.stringify(query3),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.errors) {
              console.log("Error: ", json.errors);
            }
          })
          .catch((e) => {
            console.log("Caught Error: ", e);
          });

        const stripeItems: StripeInput[] = cart.map((cartItem: CartItem) => {
          const product = products.find((p: Product) => p.id === cartItem.id);
          if (!product) {
            throw new Error(`Product with ID ${cartItem.id} not found`);
          }
          return {
            product_id: cartItem.id,
            name: (product as Product).name,
            image: (product as Product).image[0], 
            quantity: cartItem.quantity,
            price: (product as Product).price
          };
        });
        console.log("stripe items: ", JSON.stringify(stripeItems))
        const response = await fetch('/api/checkout_sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(stripeItems),
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



        ////////////////////////////////////////////////////////////////////////

        // const inputOrder = cart.map((item:CartItem) => ({
        //   account_id: account_id,
        //   product_id: item.id,
        //   quantities: item.quantity
        // }));
  
        
        // const orderResponse = await fetch('http://localhost:3015/api/v0/order', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(orderInput)
        // });
        
        // if (!orderResponse.ok) {
        //   const errorText = await orderResponse.text();
        //   console.error('Error response from server:', errorText);
        //   throw new Error('Network response was not ok');
        // }
        
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
