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



export function BottomBar() {

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
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Sign In" icon={<LoginIcon />} />
          <BottomNavigationAction label="Orders" icon={<LocalShippingIcon />} />
          <BottomNavigationAction label="Cart" icon={<ShoppingCartIcon />} />
          <BottomNavigationAction label="Switch to Spanish" icon={<SettingsBackupRestoreIcon />} />
    
        </BottomNavigation>
      </Box>
    );
  }
}