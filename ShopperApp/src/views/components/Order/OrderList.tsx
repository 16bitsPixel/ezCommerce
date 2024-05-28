import React from 'react';
import {List, Typography, Box, Button} from '@mui/material';
import Grid from '@mui/material/Grid';
// import Card from '@mui/material/Card';
// import CardMedia from '@mui/material/CardMedia';
import { LoginContext } from '@/context/Login';
// import { Button } from '@mui/base';

interface Order {
    order_id: string;
    product_id: string[];
}

export function OrderList() {

  const [orders, setOrders] = React.useState<Order[]>([])
  const [status, setStatus] = React.useState<{ [key: string]: string }>({});
  const {id} = React.useContext(LoginContext);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3015/api/v0/order?accountId=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [id]);
  
  const handleCheckStatus = async (orderId: string) => {
    const response = await fetch(`http://localhost:3015/api/v0/order/${orderId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setStatus(prevStatus => ({ ...prevStatus, [orderId]: data.status }));
  };

  return (
    <Box style={{display: 'flex', flexDirection: 'column', paddingTop: '20px'}}>
      <List>
        {orders.map((item, index) => (
          <Grid container spacing={{ xs: 2, sm: 4, md: 6 }} key={index}>
            <Grid item xs={6} sm={6} md={6}>
              <Typography variant="body1">
                                        Order ID: {item.order_id}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <Typography variant="body1">
                                        Product ID: {item.product_id.join(', ')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Button onClick={() => handleCheckStatus(item.order_id)}>Check Status</Button>
              {status[item.order_id] && (
                <Typography variant="body2">Status: {status[item.order_id]}</Typography>
              )}
            </Grid>
          </Grid>
        ))}
      </List>
    </Box>
  );
}