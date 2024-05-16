import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { ScreenSizeContext } from '@/context/ScreenSize';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { LoginContext } from '@/context/Login';


export function BottomBar() {
  const { t } = useTranslation('common');
  const router = useRouter();  

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
          <BottomNavigationAction sx={{ minWidth: "70px" }} label={t('sign-in')} icon={<LoginIcon />} onClick={handleSignIn}/>

        </BottomNavigation>
      </Box>
    );
  }
}