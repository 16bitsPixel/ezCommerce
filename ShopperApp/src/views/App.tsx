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
import { Books } from './Books'
import { Login } from './Login'
import { LoginProvider } from '../context/Login'
import { TrendingList  } from './components/trendingList';

export function App() {
  return (
    <LoginProvider>
      <Books/>
      <TrendingList/>
      <Login/>
    </LoginProvider>
  )
}