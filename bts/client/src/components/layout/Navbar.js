import {
  Fragment,
  useEffect,
  useContext,
  useState,
  Suspense,
  lazy,
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Grid,
  Link,
} from '@material-ui/core';
import { Menu, BugReport } from '@material-ui/icons';
import CircularProgress from '@mui/material/CircularProgress';
import { useStyles } from '../hooks/useStyles';
import { AuthContext } from '../context/auth-context';
import AccountDropdown from '../dashboard/dropdowns/AccountDropdown';
// import NotificationDropdown from '../dashboard/dropdowns/NotificationDropdown';

const NotificationDropdown = lazy(() =>
  import('../dashboard/dropdowns/NotificationDropdown')
);

function Navbar(props) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    fetch(
      process.env.NODE_ENV === 'development'
        ? `http://192.168.1.9:8080/auth/user`
        : `https://protected-basin-15687.herokuapp.com/auth/user`,
      {
        headers: {
          Authorization: 'Bearer ' + auth.token,
        },
      }
    )
      .then((res) => {
        if (res.status === 404 || res.status === 500 || res.status === 401) {
          auth.logout();
        }
        return res.json();
      })
      .then((resData) => {
        setUserData(resData);
      })
      .catch((err) => {});
  }, [auth]);
  return (
    <Fragment>
      {userData && (
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
              <Suspense fallback={<div />}>
                <NotificationDropdown userData={userData} />
              </Suspense>
              <AccountDropdown userData={userData} />
            </div>
          </Toolbar>
        </AppBar>
      )}
      {!userData && (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Grid>
      )}
    </Fragment>
  );
}

export default Navbar;
