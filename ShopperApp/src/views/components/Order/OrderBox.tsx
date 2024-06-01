import React from 'react';
import { Box, Typography, Grid, Divider, Button} from '@mui/material';

import { LoginContext } from '@/context/Login';
import { OrderContext } from '@/context/Order';
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
  const { id, accessToken, userName } = React.useContext(LoginContext);
  const {orderTotal} = React.useContext(OrderContext);
  const [orders, setOrders] = React.useState<Order[]>([]);

  React.useEffect(() => {
    fetchOrders(accessToken, id, { setOrders });
  }, [accessToken, id]);

  return (
    <Box className='OrderDiv' sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
      <Box sx={{ width: '75%' }}>
        {orders.map((order: Order, index) => (
          <Box key={index} sx={{ marginBottom: 4, border: '1px solid #e0e0e0', borderRadius: 2, padding: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Typography variant="subtitle1"><strong>ORDER PLACED</strong></Typography>
                <Typography>{new Intl.DateTimeFormat('en-US').format(new Date(order.date))}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle1"><strong>TOTAL</strong></Typography>
                <Typography>${orderTotal}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle1"><strong>SHIP TO</strong></Typography>
                <Typography>{userName}</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ margin: '16px 0' }} />
            <OrderCard ids={order.productId} status={order.status} quantity={order.quantities} />
            <Divider sx={{ margin: '16px 0' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button className = 'orderButton' variant="contained" >Get product support</Button>
              <Box>
                <Button variant="outlined" sx={{ marginRight: 1 }}>Track package</Button>
                <Button variant="outlined" sx={{ marginRight: 1 }}>Return or replace items</Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}