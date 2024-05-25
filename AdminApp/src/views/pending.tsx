import React, { useState } from 'react';
import { List, ListItem, Button, Typography, Box, Grid, Collapse, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Inbox as InboxIcon } from '@mui/icons-material';

export interface vendor{
    id: number,
    name: string
}

const PendingVendors = (props: { initialVendors: vendor[] }) => {
  const { initialVendors } = props;  
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const [vendors, setVendors] = useState(initialVendors);
  const handleAccept = (vendorId:number) => {
    setVendors(vendors.filter((vendor) => vendor.id !== vendorId));
    alert(`Vendor ${vendorId} accepted!`);
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
                  <ListItem key={vendor.id} sx={{ paddingLeft: 4 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Typography variant="body1">{vendor.name}</Typography>
                      </Grid>
                      <Grid item>
                        <Button variant="contained" color="primary" size="small" onClick={() => handleAccept(vendor.id)}>
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
