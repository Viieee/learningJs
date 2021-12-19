import React from 'react';
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link as RouterLink } from 'react-router-dom';
import useInput from '../hooks/useInput';
import { useStyles } from '../hooks/useStyles';

// validation
const isEmail = (value) => /$^|.+@.+..+/.test(value);
const isEmpty = (value) => value.length >= 7;

function Signin() {
  const classes = useStyles();
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

  const {
    value: passwordValue,
    isValid: passwordValid,
    hasError: passwordHasError,
    onChangeHandler: passwordChangeHandler,
    onBlurHandler: passwordBlurHandler,
    reset: resetPassword,
    errorMessage: passwordErrorMessage,
    // setErrorMessage: setPasswordErrorMessage,
  } = useInput(isEmpty, 'password length should be more than 7 characters');

  function submitHandler(e) {
    e.preventDefault();
    if (!emailIsValid && !passwordValid) {
      return;
    }
    resetEmail();
    resetPassword();
  }

  return (
    <Grid>
      <Paper className={classes.innerPaperStyle}>
        <Grid align="center">
          <Avatar className={classes.avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <h2>Sign In</h2>
        </Grid>
        <form onSubmit={submitHandler}>
          <TextField
            label="E-mail"
            name="email"
            placeholder="Enter e-mail"
            value={emailValue}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            error={emailHasError}
            helperText={emailHasError && emailErrorMessage}
            fullWidth
            required
          />
          <TextField
            label="Password"
            name="password"
            placeholder="Enter password"
            type="password"
            value={passwordValue}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
            error={passwordHasError}
            helperText={passwordHasError && passwordErrorMessage}
            fullWidth
            required
          />
          <Button
            type="submit"
            color="primary"
            className={classes.btnstyle}
            variant="contained"
            fullWidth
          >
            Sign in
          </Button>
        </form>
        <Typography>
          <Link component={RouterLink} to="/forget_password">
            Forgot password?
          </Link>
        </Typography>
        <Typography>
          Don't have an account?
          <Link component={RouterLink} to="/signup">
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Grid>
  );
}

export default Signin;
