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
  
  const loginContext = React.useContext(LoginContext);
  const { isSmallScreen, setSmallScreen } = React.useContext(ScreenSizeContext);
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
  }, [setSmallScreen]);

  React.useEffect(() => {
    // Update the value state based on the current route
    switch (router.pathname) {
      case '/':
        setValue(0);
        break;
      case '/order':
        setValue(2);
        break;
      case '/cart':
        setValue(3);
        break;
      case '/login':
        setValue(4);
        break;
      default:
        setValue(0);
        break;
    }
  }, [router.pathname]);

  const handleChangeLocale = () => {
    const changeTo = router.locale === 'en' ? 'es' : 'en';
    router.push(router.pathname, router.asPath, { locale: changeTo });
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleOrder = () => {
    router.push('/order');
  };

  const handleCart = () => {
    router.push('/cart');
  };

  const handleHome = () => {
    router.push('/');
  };

  const handleLogout = () => {
    loginContext.setAccessToken('');
    loginContext.setUserName('');
    router.push('/');
  };

  const handleNavigationChange = (event:any, newValue:any) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        handleHome();
        break;
      case 1:
        handleChangeLocale();
        break;
      case 2:
        handleOrder();
        break;
      case 3:
        handleCart();
        break;
      case 4:
        loginContext.accessToken.length < 1 ? handleSignIn() : handleLogout();
        break;
      default:
        break;
    }
  };

  if (!isSmallScreen) {
    return null;
  } else {
    return (
      <Box className='bottomBarContainer'>
        <BottomNavigation
          showLabels
          value={value}
          onChange={handleNavigationChange}
        >
          <BottomNavigationAction sx={{ minWidth: "70px" }} label={t('home')} icon={<HomeIcon />} />
          <BottomNavigationAction label={t('change-locale')} icon={<SettingsBackupRestoreIcon />} />
          <BottomNavigationAction sx={{ minWidth: "70px" }} label={t('orders')} icon={<LocalShippingIcon />} />
          <BottomNavigationAction sx={{ minWidth: "70px" }} label={t('cart')} icon={<ShoppingCartIcon />} />
          {loginContext.accessToken.length < 1 ? (
            <BottomNavigationAction
              sx={{ minWidth: "70px" }}
              label={t('sign-in')}
              icon={<LoginIcon />}
            />
          ) : (
            <BottomNavigationAction
              sx={{ minWidth: "70px" }}
              label={t('logout')}
              icon={<LogoutIcon />}
            />
          )}
        </BottomNavigation>
      </Box>
    );
  }
}
