import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import CssBaseline from '@mui/material/CssBaseline';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ScreenSizeContext } from '@/context/ScreenSize';
import { LoginContext } from '../../context/Login';
import { SearchContext } from '@/context/SearchContext';
import Image from 'next/image';

export function TopBar() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [language, setLanguage] = React.useState(router.locale);
  const loginContext = React.useContext(LoginContext)
  const {isSmallScreen} = React.useContext(ScreenSizeContext)
  const { setSearchTerm } = React.useContext(SearchContext);
  const [inputValue, setInputValue] = React.useState('');

  const handleSignIn = () => {
    router.push('/login');
  }

  const handleLogout = () => {
    loginContext.setAccessToken('');
    loginContext.setUserName('');
    router.push('/');
  };

  const handleOrder = () => {
    if (loginContext.accessToken.length < 1) {
      router.push('/login');
    } else {
      router.push('/order');
    }
  };

  const handleCart = () => {
    router.push('/cart');
  };

  const handleHome = () => {
    router.push('/');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    setSearchTerm(inputValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLanguageChange = (event : any) => {
    const newLang = event.target.value;
    setLanguage(newLang);
    router.push(router.pathname, router.asPath, { locale: newLang });
  };

  return (
    <Box className="centerContainer">
      <CssBaseline />
      <AppBar position="static" sx={{ bgcolor: '#131921' }}>
        <Toolbar className="topBar" style={{ display: 'flex', justifyContent: 'space-between' }}>
          {!isSmallScreen && (
            <Button onClick={handleHome} style={{ color: 'white', marginRight: '8px' }}>
                ezCommerce
            </Button>
          )}
          {!isSmallScreen && (
            <Select
              value={language}
              onChange={handleLanguageChange}
              displayEmpty
              inputProps={{ 'aria-label': 'select language' }}
              style={{ color: 'white', fontSize: '0.875rem' }}
            >
              <MenuItem value="en">
                <Image 
                  src="https://img.icons8.com/office/80/usa.png" 
                  alt="English" 
                  width={13}
                  height={12}
                  style={{ marginRight: 8 }} 
                />
              EN
              </MenuItem>
              <MenuItem value="es">
                <Image 
                  src="https://img.icons8.com/office/80/spain-2.png" 
                  alt="Español" 
                  width={13}
                  height={12}
                  style={{ marginRight: 8 }} 
                />
              ES
              </MenuItem>
            </Select>
          )}
          <div className="search" style={{ flexGrow: 1, justifyContent: 'center', display: 'flex', maxWidth: '700px', margin: '0 auto' }}>
            <InputBase
              className="styledInputBase"
              placeholder={t('search-ezCommerce') || 'Search EzCommerce'}
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <Button className="searchIcon" onClick={handleSearch}>
              <SearchIcon />
            </Button>
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
              <Button variant="outlined" onClick={handleCart} style={{ color: 'white' }}>{t('cart')}</Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}