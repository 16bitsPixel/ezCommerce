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
import { Books } from '../views/Books'
import { Login } from '../views/Login'
import { LoginProvider } from '../context/Login'

export function App() {
  return (
    <LoginProvider>
        <Books/>
        <Login/>
    </LoginProvider>
  )
}