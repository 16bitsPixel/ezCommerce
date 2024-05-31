import React from 'react';
import { List, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { LoginContext } from '@/context/Login';

interface Order {
  orderId: string;
  productId: string[];
  date: string;
  status: string;
  quantities: number[];
}

export function OrderList() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const { id, accessToken } = React.useContext(LoginContext);

  React.useEffect(() => {
    const fetchOrders = () => {
      const query = {
        query: `query GetOrders {
          order {
            orderId
            productId
            date
            status
            quantities
          }
        }`,
      };

      fetch('/api/graphql', {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
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

    fetchOrders();
  }, [id, accessToken]);

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', paddingTop: '20px', paddingBottom: '20px' }}>
      <List>
        {orders.map((item, index) => (
          <Grid container spacing={{ xs: 2, sm: 4, md: 6 }} key={index}>
            <Grid item xs={6} sm={6} md={6}>
              <Typography variant="body1">Order ID: {item.orderId}</Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <Typography variant="body1">
              Product IDs: {item.productId.join(', ')}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <Typography variant="body1">Date: {new Date(item.date).toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <Typography variant="body1">Status: {item.status}</Typography>
            </Grid>
          </Grid>
        ))}
      </List>
    </Box>
  );
}
