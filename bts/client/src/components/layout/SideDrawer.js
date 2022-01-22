import { useState } from 'react';
import { Box, CssBaseline, Drawer } from '@material-ui/core';
import Navbar from './Navbar';
import SideDrawerContent from './SideDrawer-Content';

const drawerWidth = 220;

function SideDrawer(props) {
  const { children } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box style={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="nav"
        style={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
        >
          <SideDrawerContent handleDrawerToggle={handleDrawerToggle} />
        </Drawer>
      </Box>
      <Box
        component="main"
        style={{
          flexGrow: 1,
          padding: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default SideDrawer;
