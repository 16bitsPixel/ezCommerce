import React, { useEffect, useState } from 'react';
import { List, ListItem, Button, Typography, Box, Grid, Collapse, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Inbox as InboxIcon } from '@mui/icons-material';
import { LoginContext } from '../context/Login'
import { getVendors } from './Home';
export interface Vendor{
    vendorId: number,
    name: string
}

const PendingVendors = (props: { initialVendors: Vendor[], state: React.Dispatch<React.SetStateAction<Vendor[]>> }) => {
  const { initialVendors, state } = props;  
  const [open, setOpen] = useState(false);
  const loginContext = React.useContext(LoginContext)

  const acceptVendors = (id:number)=>{
    console.log(`mutation accept {acceptVendors(input: {id: "${id}"}){name}}`);
    console.log(`Bearer ${loginContext.accessToken}`);
    const query = {
      query: `
          mutation acceptVendors($input: VendorId!) {
            acceptVendors(input: $input) {
              name
            }
          }
        `,
      variables: {
        input: {
          id: id
        }
      }
    };
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Authorization': `Bearer ${loginContext.accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json()
      })
      .then((json) => {
        if (json.errors) {
          console.log(`accepting new vendor caused an error from the backend`);
          console.log(json.errors);
        } else {
          console.log(json.data.acceptVendors)
          getVendors(state, loginContext.accessToken);
        }
      })
  }

  const handleClick = () => {
    setOpen(!open);
  };

  const [vendors, setVendors] = useState(initialVendors);
  useEffect(() => {
    setVendors(initialVendors);
  }, [initialVendors]);

  const handleAccept = (vendorId:number) => {
    setVendors(vendors.filter((vendor) => vendor.vendorId !== vendorId))
    acceptVendors(vendorId);
    
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <List>
            <ListItemButton onClick={handleClick}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Pending Vendors" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {vendors.map((vendor) => (
                  <ListItem key={vendor.vendorId} sx={{ paddingLeft: 4 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Typography variant="body1">{vendor.name}</Typography>
                      </Grid>
                      <Grid item>
                        <Button variant="contained" color="primary" size="small" onClick={() => handleAccept(vendor.vendorId)}>
                          Accept
                        </Button>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PendingVendors;
