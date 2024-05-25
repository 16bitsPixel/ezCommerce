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
import React from 'react';
import TopBar from './Topbar';
import { LoginContext } from '../context/Login'


export function Home() {
  const loginContext = React.useContext(LoginContext)

  React.useEffect(() => {
    
  }, [loginContext.accessToken]);

  if (loginContext.accessToken.length > 0) {
    return (
      <div>
        <TopBar/>
        Hello Admin
      </div>
    )
  }
  else {
    return null
  }
}
