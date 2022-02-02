import { useState, useEffect, useContext, Fragment } from 'react';
import {
  Card,
  Divider,
  Typography,
  Grid,
  // ImageIcon,
  // Button,
} from '@material-ui/core';
// import { Image } from '@material-ui/icons';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthContext } from '../../../context/auth-context';
import { useStyles } from '../../../hooks/useStyles';
import AccountEdit from './AccountEdit';
import PasswordEdit from './PasswordEdit';

export default function AccountSettings() {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch(`http://192.168.1.5:8080/auth/user`, {
      headers: {
        Authorization: 'Bearer ' + auth.token,
      },
    })
      .then((res) => {
        if (res.status === 404 || res.status === 500 || res.status === 401) {
          auth.logout();
        }
        return res.json();
      })
      .then((resData) => {
        setUserData(resData.user);
      })
      .catch((err) => {});
  }, [auth]);
  return (
    <Card className={classes.cardSettingsBase}>
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
      {userData && (
        <Fragment>
          <Typography variant="h6">Account Settings</Typography>
          <Divider />
          <AccountEdit user={userData} />
          <Divider />
          <Typography variant="h6" style={{ marginTop: 10 }}>
            Password Change
          </Typography>
          <PasswordEdit />
        </Fragment>
      )}
    </Card>
  );
}
