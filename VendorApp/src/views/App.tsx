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
import Login from './Login'
import { LoginProvider } from '../context/Login'

export function App() {
  return (
    <LoginProvider>
      <Login/>
    </LoginProvider>
  )
}