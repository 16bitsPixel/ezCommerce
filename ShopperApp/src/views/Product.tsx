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
import { ProductInformation } from './components/Product/ProductInformation';
import {TopBar} from './components/TopBar'

export function Product() {
  return (
    <>
      <ScreenSizeProvider>
        <TopBar/>
        <ProductInformation/>
        <BottomBar/>
      </ScreenSizeProvider>
    </>
  )
}