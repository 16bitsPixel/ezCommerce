import React from 'react';
import { Box, Typography, Grid, Divider} from '@mui/material';
import { useTranslation } from 'next-i18next';

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
  const { id, accessToken, userName } = React.useContext(LoginContext);
  const [orderTotals, setOrderTotals] = React.useState<number[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const { t } = useTranslation('common');



  React.useEffect(() => {
    fetchOrders(accessToken, id, { setOrders });
  }, [accessToken, id]);

  const handleTotalChange = (index: number, total: number) => {
    setOrderTotals(prevTotals => {
      const newTotals = [...prevTotals];
      newTotals[index] = total;
      return newTotals;
    });
  };

  return (
    <Box className="OrderDiv" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', marginBottom: 4 }}>
        {t('your-orders')}
      </Typography>
      <Box sx={{ width: '75%' }}>
        {orders.map((order: Order, index) => (
          <Box key={index} sx={{ marginBottom: 4, border: '1px solid #e0e0e0', borderRadius: 2, padding: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Typography variant="subtitle1"><strong>{t('order-placed')}</strong></Typography>
                <Typography>
                  {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(order.date))}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle1"><strong>{t('total')}</strong></Typography>
                <Typography>${orderTotals[index]?.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle1"><strong>{t('ship-to')}</strong></Typography>
                <Typography>{userName}</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ margin: '16px 0' }} />
            <OrderCard
              ids={order.productId}
              status={order.status}
              quantity={order.quantities}
              onTotalChange={(total: number) => handleTotalChange(index, total)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}