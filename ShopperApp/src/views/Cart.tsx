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
import { Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import {CartList} from './components/Cart/CartList';
import * as React from 'react';

export function Cart() {
  const { t } = useTranslation('common');

  return (
    <>
      <ScreenSizeProvider>
        <TopBar/>
        <Typography variant="h5" gutterBottom>
            {t('shopping-cart')}
        </Typography>
        <CartList/>
        <BottomBar/>
      </ScreenSizeProvider>
    </>
  )
}