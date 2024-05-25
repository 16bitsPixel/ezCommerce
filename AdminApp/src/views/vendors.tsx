import React, { useState } from 'react';
import { List, ListItem, Typography, Box, Grid, Collapse, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Inbox as InboxIcon } from '@mui/icons-material';

export interface vendor{
    vendorId: number
    name: string
}

const Vendors = (props: { initialVendors: vendor[] }) => {
  const { initialVendors } = props;  
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
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
              <ListItemText primary="Current Vendors" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {initialVendors.map((vendor) => (
                  <ListItem key={vendor.vendorId} sx={{ paddingLeft: 4 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Typography variant="body1">{vendor.name}</Typography>
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

export default Vendors;
