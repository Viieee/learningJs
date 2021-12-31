import {
  Box,
  CssBaseline,
  Drawer,
} from '@material-ui/core';

import { useState } from 'react';
import Navbar from './Navbar';
import { useStyles } from '../hooks/useStyles';
import SideDrawerContent from './SideDrawer-Content';

const drawerWidth = 220;

function SideDrawer(props) {
  const classes = useStyles();
  const { children } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          className={classes.mobileDrawer}
        >
          <SideDrawerContent handleDrawerToggle={handleDrawerToggle}/>
        </Drawer>
        <Drawer
          variant="permanent"
          className={classes.drawer}
          open
        >
          <SideDrawerContent handleDrawerToggle={handleDrawerToggle}/>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default SideDrawer;
