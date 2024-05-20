import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { LoginContext } from '../../context/Login';
import { ScreenSizeContext } from '@/context/ScreenSize';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export function BottomBar() {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const loginContext = React.useContext(LoginContext)
  const {isSmallScreen, setSmallScreen} = React.useContext(ScreenSizeContext)
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setSmallScreen(window.innerWidth <= 900); 
    };
    checkScreenSize(); 
    window.addEventListener('resize', checkScreenSize);
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  })

  const handleChangeLocale = () => {
    const changeTo = router.locale === 'en' ? 'es' : 'en';
    router.push(router.pathname, router.asPath, { locale: changeTo });
  };

  const handleSignIn = () => {
    router.push('/login');
  }

  const handleLogout = () => {
    loginContext.setAccessToken('');
    loginContext.setUserName('');
    router.push('/');
  };

  if (!isSmallScreen) {
    return null
  } else {
    return (
      <Box className='bottomBarContainer'>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction sx={{ minWidth: "70px" }} label={t('home')} icon={<HomeIcon />} />
          <BottomNavigationAction
            label={t('change-locale')}
            icon={<SettingsBackupRestoreIcon />}
            onClick={handleChangeLocale} 
          />    
          <BottomNavigationAction sx={{ minWidth: "70px" }} label={t('orders')} icon={<LocalShippingIcon />} />
          <BottomNavigationAction sx={{ minWidth: "70px" }} label={t('cart')} icon={<ShoppingCartIcon />} />
          {loginContext.accessToken.length < 1 ? (
            <BottomNavigationAction
              sx={{ minWidth: "70px" }}
              label={t('sign-in')}
              icon={<LoginIcon />}
              onClick={handleSignIn}
            />
          ) : (
            <BottomNavigationAction
              sx={{ minWidth: "70px" }}
              label={t('logout')}
              icon={<LogoutIcon />}
              onClick={handleLogout}
            />
          )}
        </BottomNavigation>
      </Box>
    );
  }
}