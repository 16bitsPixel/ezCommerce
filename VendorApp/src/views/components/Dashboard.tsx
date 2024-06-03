import React from 'react';
import classNames from 'classnames';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { LoginContext } from '@/context/Login';
import { VendorKeys } from './VendorKeys';
const Dashboard = () => {
  const loginContext = React.useContext(LoginContext);

  const handleLogout = () => {
    loginContext.setAccessToken('')
    loginContext.setUserName('')
    loginContext.setView('Login')
  };

  if (loginContext.accessToken.length > 1) {
    return (
      <div className="root">
        <CssBaseline />
        <AppBar
          position="absolute"
          className={classNames('appBar')}
        >
          <Toolbar disableGutters={!true} className="toolbar">
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              className={classNames('menuButton')}
            >
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className="title"
            >
              Vendor Dashboard
            </Typography>
            <IconButton aria-label="Logout" onClick={handleLogout}>Logout</IconButton>
          </Toolbar>
        </AppBar>

        <main className="content">
          <div className="appBarSpacer" />
          <Typography variant="h4" gutterBottom component="h2">
            Vendor Keys
          </Typography>
          <VendorKeys />
        </main>


      </div>
    );
  } else {
    return null;
  }
};

export default Dashboard;
