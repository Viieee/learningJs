import { useState, Suspense, lazy } from 'react';
import { Box, CssBaseline, Drawer } from '@material-ui/core';

const Navbar = lazy(() => import('./Navbar'));
const SideDrawerContent = lazy(() => import('./SideDrawer-Content'));

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
      <Suspense fallback={<div />}>
        <Navbar handleDrawerToggle={handleDrawerToggle} />
      </Suspense>
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
          <Suspense fallback={<div />}>
            <SideDrawerContent handleDrawerToggle={handleDrawerToggle} />
          </Suspense>
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
