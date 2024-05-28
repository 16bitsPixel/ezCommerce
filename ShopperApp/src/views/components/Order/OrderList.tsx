import React from 'react';
import {List, Typography, Box} from '@mui/material';
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
  const {id} = React.useContext(LoginContext);

  React.useEffect(() => {
    console.log("id: ", id)
    const url = new URL('http://localhost:3015/api/v0/order/');
    if (id) {
      url.searchParams.append('accountId', id);
    }
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data)
        console.log("order_id: ", orders)
      })
  }, [])

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
          </Grid>
        ))}
      </List>
    </Box>
  );
}