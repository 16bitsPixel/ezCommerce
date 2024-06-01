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
import { OrderProvider } from '@/context/Order';
import { ScreenSizeProvider } from '@/context/ScreenSize'
import { BottomBar } from './components/BottomBar';
import {TopBar} from './components/TopBar'
import { OrderBox } from './components/Order/OrderBox';

export function Order() {
  return (
    <>
      <ScreenSizeProvider>
        <TopBar/>
        <OrderProvider>
          <OrderBox />
        </OrderProvider>
        <BottomBar/>
      </ScreenSizeProvider>
    </>
  )
}