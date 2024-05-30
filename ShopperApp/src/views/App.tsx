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
import { SearchProvider } from '@/context/SearchContext';
import { TrendingList  } from './components/TrendingList';
import { SearchResult } from './components/SearchResult'
import { BottomBar } from './components/BottomBar';
import {TopBar} from './components/TopBar'
import { Gallery } from './components/Gallery';
import { Box } from '@mui/material';

export function App() {
  return (
    <SearchProvider>
      <ScreenSizeProvider>
        <TopBar/>
        <BottomBar/>
      </ScreenSizeProvider>
      <Box>
        <Gallery/>
        <Box mt={4}>
          <TrendingList />
          <SearchResult />
        </Box>
      </Box>
    </SearchProvider>
  )
}