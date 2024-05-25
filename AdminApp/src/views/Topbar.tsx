import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LogoutIcon from '@mui/icons-material/Logout';
import { LoginContext } from '../context/Login'
const TopBar = () => {
  const {setUserName, setAccessToken} = useContext(LoginContext)
  const handleLogout = () => {
    
    console.log('Logged out');
    setUserName('');
    setAccessToken('');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Admin App 
        </Typography>
        <Box>
          <Button color="inherit" onClick={handleLogout}>
            <LogoutIcon/>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
