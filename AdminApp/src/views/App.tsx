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
import { LoginProvider } from '../context/Login'
import  Login  from './Login'
import { Home } from './Home'
export function App() {
  return (
    <LoginProvider>
      <Login/>
      <Home/>
    </LoginProvider>
  )
}