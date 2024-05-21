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
import { LoginContext } from '../../context/Login';

export function TopBar() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const changeTo = router.locale === 'en' ? 'es' : 'en'
  const loginContext = React.useContext(LoginContext)
  const {isSmallScreen} = React.useContext(ScreenSizeContext)

  const handleSignIn = () => {
    router.push('/login');
  }

  const handleLogout = () => {
    loginContext.setAccessToken('');
    loginContext.setUserName('');
    router.push('/');
  };

  const handleOrder = () => {
    router.push('/order');
  };

  return (
    <Box className="centerContainer">
      <CssBaseline />
      <AppBar position="static" sx={{ bgcolor: '#131921' }}>
        <Toolbar className="topBar" style={{ display: 'flex', justifyContent: 'space-between' }}>
          {!isSmallScreen && (
            <div style={{ flexGrow: 0, marginRight: 'auto' }}>
              <Link href="/" locale={changeTo} passHref>
                <Button variant="text">{t('change-locale')}</Button>
              </Link>
            </div>
          )}
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
          {!isSmallScreen && (
            <div className="topbar-buttons" style={{ flexGrow: 0, marginLeft: 'auto' }}>
              {loginContext.accessToken.length < 1 ? (
                <Button variant="outlined" onClick={handleSignIn} style={{ color: 'white', marginRight: '8px' }}>
                  {t('sign-in')}
                </Button>
              ) : (
                <Button variant="outlined" onClick={handleLogout} style={{ color: 'white', marginRight: '8px' }}>
                  {t('logout')}
                </Button>
              )}
              <Button variant="outlined" onClick={handleOrder} style={{ color: 'white', marginRight: '8px' }}>
                {t('orders')}
              </Button>
              <Button variant="outlined" style={{ color: 'white' }}>{t('cart')}</Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}