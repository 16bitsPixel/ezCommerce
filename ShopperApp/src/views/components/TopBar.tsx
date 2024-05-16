import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ScreenSizeContext } from '@/context/ScreenSize';


export function TopBar() {

  const { t } = useTranslation('common');
  const router = useRouter();

  const changeTo = router.locale === 'en' ? 'es' : 'en'

  const {isSmallScreen} = React.useContext(ScreenSizeContext)


  const handleSignIn = () => {
    router.push('/login');
  }

  if (isSmallScreen) {
    return (
      <Box className='centerContainer'>
        <CssBaseline/>
        <AppBar position="static" sx={{ bgcolor: "#131921" }}>
          <Toolbar className='topBar' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="search" style={{ flexGrow: 1, justifyContent: 'center', display: 'flex', maxWidth: '700px', margin: '0 auto' }}>
              <div className="searchIcon">
                <SearchIcon />
              </div>
              <InputBase
                className="styledInputBase"
                placeholder={t('search-ezCommerce') || 'Search EzCommerce'}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
          </Toolbar>
        </AppBar>
      </Box>
  
    )
  } else {
    return (
      <Box className='centerContainer'>
        <CssBaseline/>
        <AppBar position="static" sx={{ bgcolor: "#131921" }}>
          <Toolbar className='topBar' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flexGrow: 0, marginRight: 'auto' }}>
              <Link href="/" locale={changeTo} passHref>
                <Button variant="text">{t('change-locale')}</Button>
              </Link>
            </div>
            <div className="search" style={{ flexGrow: 1, justifyContent: 'center', display: 'flex', maxWidth: '700px', margin: '0 auto' }}>
              <div className="searchIcon">
                <SearchIcon />
              </div>
              <InputBase
                className="styledInputBase"
                placeholder={t('search-ezCommerce') || 'Search EzCommerce'}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <div className='topbar-buttons' style={{ flexGrow: 0, marginLeft: 'auto' }}>
              <Button variant="outlined" onClick={handleSignIn} style={{ color: 'white', marginRight: '8px' }}>{t('sign-in')}</Button>
              <Button variant="outlined" style={{ color: 'white', marginRight: '8px' }}>{t('orders')}</Button>
              <Button variant="outlined" style={{ color: 'white' }}>{t('cart')}</Button>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
}