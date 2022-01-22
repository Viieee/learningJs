import { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
} from '@material-ui/core';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CloseIcon from '@material-ui/icons/Close';
import { useStyles } from '../hooks/useStyles';
import useInput from '../hooks/useInput';

// validation
const isEmail = (value) =>
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
    value
  );

function ForgotPassword() {
  const classes = useStyles();
  const history = useHistory();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    onChangeHandler: emailChangeHandler,
    onBlurHandler: emailBlurHandler,
    reset: resetEmail,
    errorMessage: emailErrorMessage,
    // setErrorMessage: setEmailErrorMessage,
  } = useInput(isEmail, 'email is invalid');

  function submitHandler(e) {
    e.preventDefault();
    if (!emailIsValid) {
      return;
    }
    fetch('http://192.168.1.5:8080/auth/forget-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailValue,
      }),
    })
      .then((res) => {
        if (res.status === 404) {
          throw new Error('Email is not registered.');
        }
        return res.json();
      })
      .then((resData) => {
        setShowSuccess(true);
        setSuccessMessage(
          'Password reset link was sent to your email, please check your email to reset your password.'
        );
        resetEmail();
        return setTimeout(function () {
          history.replace('/signin');
        }, 5000);
      })
      .catch((err) => {
        setShowError(true);
        setErrorMessage(err.message);
      });
    resetEmail();
  }

  return (
    <Grid>
      <Paper elevation={20} className={classes.paperStyle}>
        <Grid align="left" className={classes.closeButton}>
          <Link component={RouterLink} to="/signin">
            <CloseIcon />
          </Link>
        </Grid>
        {showSuccess && (
          <Alert
            severity="success"
            onClose={() => {
              setShowSuccess(false);
            }}
          >
            <AlertTitle>Success!</AlertTitle>
            {successMessage}
          </Alert>
        )}
        {showError && (
          <Alert
            severity="error"
            onClose={() => {
              setShowError(false);
            }}
          >
            <AlertTitle>Error</AlertTitle>
            {errorMessage}
          </Alert>
        )}
        <Grid align="center">
          <div className={classes.headerStyle}>
            <h2>Password Reset</h2>
            <Typography variant="caption" gutterBottom>
              Please fill this form so we can send you the password reset link
              to your e-mail !
            </Typography>
          </div>
        </Grid>
        <form onSubmit={submitHandler}>
          <TextField
            variant="outlined"
            label="E-mail"
            name="email"
            placeholder="Enter e-mail"
            value={emailValue}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            error={emailHasError}
            helperText={emailHasError && emailErrorMessage}
            className={classes.fieldStyle}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.buttonStyle}
          >
            Reset
          </Button>
        </form>
      </Paper>
    </Grid>
  );
}

export default ForgotPassword;
