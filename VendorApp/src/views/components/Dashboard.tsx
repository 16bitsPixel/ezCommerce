import React from 'react';
import classNames from 'classnames';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SimpleLineChart from './SimpleLineChart';
import SimpleTable from './SimpleTable';
import { LoginContext } from '@/context/Login';
import { AddProduct } from './addProduct';
const Dashboard = () => {
  const loginContext = React.useContext(LoginContext);

  if (loginContext.accessToken.length > 1) {
    return (
      <div className="root">
        <CssBaseline />
        <AppBar
          position="absolute"
          className={classNames('appBar')}
        >
          <Toolbar disableGutters={!open} className="toolbar">
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
          </Toolbar>
        </AppBar>

        <main className="content">
          <div className="appBarSpacer" />
          <Typography variant="h4" gutterBottom component="h2">
            Order Summary
          </Typography>
          <Typography component="div" className="chartContainer">
            <SimpleLineChart />
          </Typography>
          <Typography variant="h4" gutterBottom component="h2">
            Individual Orders
          </Typography>
          <div className="tableContainer">
            <SimpleTable />
          </div>
          <AddProduct />
        </main>


      </div>
    );
  } else {
    return null;
  }
};

export default Dashboard;
