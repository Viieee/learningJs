import { Fragment } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Grid,
  Link,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { Menu, BugReport } from '@material-ui/icons';
import { useStyles } from '../hooks/useStyles';
import AccountDropdown from '../dashboard/dropdowns/AccountDropdown';
import NotificationDropdown from '../dashboard/dropdowns/NotificationDropdown';

function Navbar(props) {
  const classes = useStyles();
  return (
    <Fragment>
      <AppBar color="primary" position="absolute" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Grid container direction="row" alignItems="center">
            <Typography variant="h6">
              <IconButton onClick={props.handleDrawerToggle}>
                <Menu />
              </IconButton>
            </Typography>
            <Typography className={classes.logoLg} style={{ marginLeft: 10 }}>
              <Link
                component={RouterLink}
                to="/dashboard"
                color="inherit"
                style={{ textDecoration: 'none' }}
              >
                <BugReport /> BTS
              </Link>
            </Typography>
          </Grid>
          <div className={classes.icons}>
            <NotificationDropdown />
            <AccountDropdown />
          </div>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
}

export default Navbar;
