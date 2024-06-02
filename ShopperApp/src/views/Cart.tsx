/*
#######################################################################
#
# Copyright (C) 2020-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/
import { ScreenSizeProvider } from '@/context/ScreenSize'
import { BottomBar } from './components/BottomBar';
import {TopBar} from './components/TopBar'
import { Typography, Box, Card, Divider } from '@mui/material';
import { useTranslation } from 'next-i18next';
import {CartList} from './components/Cart/CartList';
import * as React from 'react';
import { ProductProvider } from '@/context/Product';
import { CheckoutButton } from './components/Cart/CheckoutButton';

export function Cart() {
  const { t } = useTranslation('common');

  return (
    <>
      <ScreenSizeProvider>
        <TopBar/>
        <ProductProvider>
          <Box style = {{margin: '5vh 20vw 0 20vw', backgroundColor: 'white', padding: '20px'}}>
            <Card style = {{padding: 20}}>
              <Typography variant="h4" gutterBottom>
                {t('shopping-cart')}
              </Typography>
              <Divider/>
              <CartList/>
              <Divider/>
              <CheckoutButton/>
            </Card>
          </Box>
        </ProductProvider>
        <div className='bottomBarContainer'>
          <BottomBar/>
        </div>
      </ScreenSizeProvider>
    </>
  )
}