import React from 'react';
import { Box, Typography, Divider, Grid } from '@mui/material';

import { LoginContext } from '@/context/Login';
import {Order} from '../../../graphql/order/schema'
import {OrderCard} from './OrderCard';

interface FetchProductsParams {
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const fetchOrders = (accessToken:string, accountId: string,
  { setOrders }: FetchProductsParams) => {
  const variables = { accountId };
  const query = {
    query: `query getOrders($accountId: String!) {
      order(accountId: $accountId) {
        orderId
        accountId
        productId
        date
        status
        quantities
      }
    }`,
    variables, // Include variables in the query object
  };
  fetch('/api/graphql', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
  .then((res) => res.json())
  .then((json) => {
    if (json.errors) {
      console.log("Errors fetching orders: ", json.errors);
      setOrders([]);
    } else {
      setOrders(json.data.order);
      console.log("orders: ", json.data.order)
    }
  })
  .catch((e) => {
    console.log("Error: ", e);
    setOrders([]);
  });
};

export function OrderBox() {
  const {id, accessToken} = React.useContext(LoginContext);
  const [orders, setOrders] = React.useState<Order[]>([]);

  // Gives a list of orders that will then be displayed
  // in a list based on the OrderCard
  React.useEffect(() => {
    fetchOrders(accessToken, id, {setOrders});
  }, []);
  // The id and quantity values are both arrays
  return (
    <div className='OrderDiv'>
      <Box>
        {orders.map((order: Order, index) => (
          <Grid item xs={2} sm={2} md={2} key={index}>
            <OrderCard key= {order.orderId}
              ids={order.productId} 
              date = {order.date} 
              status = {order.status} 
              quantity = {order.quantities}/>
          </Grid>
        ))}
      </Box>
    </div>
  );
}