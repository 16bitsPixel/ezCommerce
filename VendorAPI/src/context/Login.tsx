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

import { PropsWithChildren, useState, createContext } from "react";
 
export const LoginContext = createContext({
  userName: '', 
  setUserName: (userName: string) => {},        // eslint-disable-line 
  accessToken: '',
  setAccessToken: (accessToken: string) => {},  // eslint-disable-line 
});

// eslint-disable-next-line 
export const LoginProvider = ({ children }: PropsWithChildren<{}>) => {
  const [userName, setUserName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  return (
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken}}>
      {children}
    </LoginContext.Provider>
  );
};