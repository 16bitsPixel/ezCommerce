/*
#######################################################################
#
# Copyright (C) 2022-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without 
# the express written permission of the copyright holder.
#
#######################################################################
*/

import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { LoginProvider } from '../context/Login';
import { SearchProvider } from '@/context/SearchContext';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <LoginProvider>
      <SearchProvider>
        <Component {...pageProps} />
      </SearchProvider>
    </LoginProvider>
  );
}

export default appWithTranslation(App)