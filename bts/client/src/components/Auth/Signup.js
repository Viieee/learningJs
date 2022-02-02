import React, { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  IconButton,
  InputAdornment,
} from '@material-ui/core';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useStyles } from '../hooks/useStyles';
import useInput from '../hooks/useInput';

// validation
const isEmail = (value) =>
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
    value
  );
const isEmptyName = (value) => value.trim().length >= 3;
const isEmptyPassword = (value) => value.trim().length >= 7;

const Signup = () => {
  const history = useHistory();
  const classes = useStyles();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const {
    value: nameValue,
    isValid: nameIsValid,
    hasError: nameHasError,
    onChangeHandler: nameChangeHandler,
    onBlurHandler: nameBlurHandler,
    reset: resetName,
    errorMessage: nameErrorMessage,
    // setErrorMessage: setNameErrorMessage
  } = useInput(isEmptyName, 'name should be longer than 3 characters');

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
  } = useInput(
    isEmptyPassword,
    'password length should be more than 7 characters'
  );

  // confirm validation
  const isValidConfirmPassword = (value) => value === passwordValue;

  const {
    value: confirmPasswordValue,
    isValid: confirmPasswordValid,
    hasError: confirmPasswordHasError,
    onChangeHandler: confirmPasswordChangeHandler,
    onBlurHandler: confirmPasswordBlurHandler,
    reset: resetConfirmPassword,
    errorMessage: confirmPasswordErrorMessage,
    // setErrorMessage: setConfirmPasswordErrorMessage
  } = useInput(
    isValidConfirmPassword,
    "confirm password input doesn't match the password input"
  );

  function submitHandler(e) {
    e.preventDefault();

    if (
      !emailIsValid &&
      !passwordValid &&
      !nameIsValid &&
      !confirmPasswordValid
    ) {
      return;
    }

    fetch('http://192.168.1.5:8080/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailValue,
        password: passwordValue,
        userName: nameValue,
      }),
    })
      .then((res) => {
        if (res.status === 409) {
          throw new Error('Email is already registered!');
        }
        if (res.status === 500) {
          throw new Error('Creating a user failed!');
        }
        return res.json();
      })
      .then((resData) => {
        resetName();
        resetEmail();
        resetPassword();
        resetConfirmPassword();
        setShowSuccess(true);
        setSuccessMessage(
          'Sign up successfull! please check your email inbox to verify your account'
        );
        return setTimeout(function () {
          history.replace('/signin');
        }, 5000);
      })
      .catch((err) => {
        setShowError(true);
        setErrorMessage(err.message);
      });
  }
  return (
    <React.Fragment>
      <Grid>
        <Paper className={classes.innerPaperStyle}>
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
          <form onSubmit={submitHandler}>
            <TextField
              label="Full Name"
              name="fullName"
              placeholder="Enter your full name"
              value={nameValue}
              onChange={nameChangeHandler}
              onBlur={nameBlurHandler}
              error={nameHasError}
              helperText={nameHasError && nameErrorMessage}
              fullWidth
              required
            />
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
              type={showPassword ? 'text' : 'password'}
              onChange={passwordChangeHandler}
              value={passwordValue}
              onBlur={passwordBlurHandler}
              error={passwordHasError}
              helperText={passwordHasError && passwordErrorMessage}
              InputProps={{
                // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
              required
            />
            <TextField
              label="Confirm Password"
              placeholder="Confirm your password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPasswordValue}
              onChange={confirmPasswordChangeHandler}
              onBlur={confirmPasswordBlurHandler}
              error={confirmPasswordHasError}
              helperText={
                confirmPasswordHasError && confirmPasswordErrorMessage
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownConfirmPassword}
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
              required
            />
            <Button
              style={{ marginTop: 30 }}
              type="submit"
              variant="contained"
              color="primary"
              className={classes.btnstyle}
              fullWidth
            >
              Sign up
            </Button>
          </form>
          <Typography>
            Already have an account?
            <Link component={RouterLink} to="/signin">
              Sign In
            </Link>
          </Typography>
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export default Signup;
