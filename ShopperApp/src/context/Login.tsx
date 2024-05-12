/* eslint-disable @typescript-eslint/no-unused-vars */
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
  setUserName: (userName: string) => {},
  accessToken: '',
  setAccessToken: (accessToken: string) => {},
  view: 'Login',
  setView: (view: string) => {} ,
  popup: false,
  setPopup: (popup: boolean) => {}
});

export const LoginProvider = ({ children }: PropsWithChildren<{}>) => {
  const [userName, setUserName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [view, setView] = useState('Login');
  const [popup, setPopup] = useState(false)
  return (
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken, view, setView, popup, setPopup}}>
      {children}
    </LoginContext.Provider>
  );
};