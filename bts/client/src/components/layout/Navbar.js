import { useState, Fragment } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Toolbar,
  Typography,
  IconButton,
  // ThemeProvider
} from '@material-ui/core';
import { Notifications, Menu, BugReport } from '@material-ui/icons';

import { useStyles } from '../hooks/useStyles';
import AccountDropdown from '../dashboard/dropdowns/AccountDropdown';

function Navbar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Fragment>
      <AppBar color="primary" position="absolute" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.logoLg}>
            <BugReport /> Bug Tracking System
          </Typography>
          <Typography variant="h6" className={classes.logoSm}>
            <IconButton onClick={props.handleDrawerToggle}>
              <Menu />
            </IconButton>
          </Typography>
          <div className={classes.icons}>
            <Badge badgeContent={2} color="secondary" className={classes.badge}>
              <Notifications />
            </Badge>
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              {/* <Avatar sx={{ width: 32, height: 32 }}>M</Avatar> */}
              <Avatar
                sx={{ width: 32, height: 32 }}
                alt="Remy Sharp"
                src="https://images.pexels.com/photos/8647814/pexels-photo-8647814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              />
            </IconButton>
          </div>
        </Toolbar>
        <AccountDropdown
          open={open}
          anchorEl={anchorEl}
          handleClose={handleClose}
        />
      </AppBar>
    </Fragment>
  );
}

export default Navbar;
