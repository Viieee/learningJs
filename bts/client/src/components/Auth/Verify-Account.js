import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, Paper, Avatar } from '@material-ui/core';
import { VerifiedUser } from '@material-ui/icons';
import CircularProgress from '@mui/material/CircularProgress';
import { useStyles } from '../hooks/useStyles';

export default function VerifyAccount() {
  const classes = useStyles();
  const params = useParams();
  const { token } = params;
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://192.168.1.5:8080/auth/verify-account/${token}`)
      .then((res) => {
        if (res.status !== 200) {
          history.replace('/signin');
        }
        return res.json();
      })
      .then((resData) => {
        setIsLoading(false);
        return setTimeout(function () {
          history.replace('/signin');
        }, 5000);
      })
      .catch((err) => {});
  }, [token, history]);
  return (
    <Grid>
      <Paper elevation={20} className={classes.paperStyle}>
        {isLoading && (
          <Grid align="center">
            <CircularProgress />
          </Grid>
        )}
        {!isLoading && (
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{ marginTop: 150 }}
          >
            <Avatar style={{ backgroundColor: '#1bbd7e' }}>
              <VerifiedUser />
            </Avatar>
            <h2>Verification Successfull!</h2>
          </Grid>
        )}
      </Paper>
    </Grid>
  );
}
