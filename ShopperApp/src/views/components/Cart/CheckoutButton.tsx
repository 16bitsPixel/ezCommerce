import { ProductContext } from "@/context/Product";
import React from "react";
import { useTranslation } from 'next-i18next';

export function CheckoutButton (){

  const {t} = useTranslation('common')
  const {products, setCart, setProducts} = React.useContext(ProductContext)
      
//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     await fetch('/api/checkout_sessions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(products),
//     })
//       .then(response => {
//         if (!response.ok) {
//           return response.text().then(errorText => {
//             console.error('Error response from server:', errorText);
//             throw new Error('Network response was not ok');
//           });
//         }
//         return response.json();
//       })
//       .then(data => {
//         if (data.url) {
//           window.location.href = data.url;
//         }
//       })
//       .then(() => {
//         await fetch('http://localhost:3015/api/v0/order', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         })
//       })
//       .then(() => {
//         setCart([]);
//         setProducts([])
//         localStorage.removeItem('cart')
//       })
//       .catch(error => {
//         console.error('Fetch error:', error);
//       });
//   };

const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
        window.location.href = data.url;
      }
  
    //   const orderResponse = await fetch('http://localhost:3015/api/v0/order', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: 
    //   });
  
    //   if (!orderResponse.ok) {
    //     const errorText = await orderResponse.text();
    //     console.error('Error response from server:', errorText);
    //     throw new Error('Network response was not ok');
    //   }
  
      setCart([]);
      setProducts([]);
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <section>
        <button type="submit" role="link" aria-label='checkout-button'>
          {t('proceed-to-checkout')}
        </button>
      </section>
      <style jsx>
        {`
        section {
          background: #ffffff;
          display: flex;
          flex-direction: column;
          width: 400px;
          height: 112px;
          border-radius: 6px;
          justify-content: space-between;
        }
        button {
          height: 36px;
          background: #556cd6;
          border-radius: 4px;
          color: white;
          border: 0;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
        }
        button:hover {
          opacity: 0.8;
        }
      `}
      </style>
    </form>
  );
}
