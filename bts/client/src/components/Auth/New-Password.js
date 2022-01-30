import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link as RouterLink } from 'react-router-dom';
import {
  Grid,
  Paper,
  // Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { useStyles } from '../hooks/useStyles';
import useInput from '../hooks/useInput';

// validation
const isEmptyPassword = (value) => value.trim().length >= 7;

export default function NewPassword() {
  const classes = useStyles();
  const params = useParams();
  const history = useHistory();
  const { token } = params;
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const {
    value: passwordValue,
    isValid: passwordValid,
    hasError: passwordHasError,
    onChangeHandler: passwordChangeHandler,
    onBlurHandler: passwordBlurHandler,
    // reset: resetPassword,
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
    // isValid: confirmPasswordValid,
    hasError: confirmPasswordHasError,
    onChangeHandler: confirmPasswordChangeHandler,
    onBlurHandler: confirmPasswordBlurHandler,
    // reset: resetConfirmPassword,
    errorMessage: confirmPasswordErrorMessage,
    // setErrorMessage: setConfirmPasswordErrorMessage
  } = useInput(
    isValidConfirmPassword,
    "confirm password input doesn't match the password input"
  );

  useEffect(() => {
    fetch(`http://192.168.1.5:8080/auth/new-password/${token}`)
      .then((res) => {
        if (res.status !== 200) {
          history.replace('/signin');
        }
        return res.json();
      })
      .then((resData) => {
        setLoading(false);
        setUserId(resData.userId);
      })
      .catch((err) => {});
  }, [token, history]);

  function submitHandler(e) {
    e.preventDefault();
    if (!passwordValid) {
      return;
    }
    fetch(`http://192.168.1.5:8080/auth/new-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        newPassword: passwordValue,
      }),
    })
      .then((res) => {
        if (res.status === 404 || res.status === 500) {
          return history.replace('/signin');
        }
        return res.json();
      })
      .then((resData) => {
        setShowSuccess(true);
        setSuccessMessage('Password changed successfully!');
        return setTimeout(function () {
          history.replace('/signin');
        }, 5000);
      })
      .catch((err) => {});
  }

  return (
    <Grid>
      {loading && (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Grid>
      )}
      {!loading && (
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
          <Grid align="center">
            <div className={classes.headerStyle}>
              <h2>Password Reset</h2>
            </div>
          </Grid>
          <form onSubmit={submitHandler}>
            <TextField
              variant="outlined"
              label="Password"
              name="password"
              placeholder="Enter password"
              type={showPassword ? 'text' : 'password'}
              onChange={passwordChangeHandler}
              value={passwordValue}
              onBlur={passwordBlurHandler}
              error={passwordHasError}
              className={classes.fieldStyle}
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
              variant="outlined"
              label="Confirm Password"
              placeholder="Confirm your password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPasswordValue}
              onChange={confirmPasswordChangeHandler}
              onBlur={confirmPasswordBlurHandler}
              error={confirmPasswordHasError}
              className={classes.fieldStyle}
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
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{
                  maxWidth: 180,
                  minWidth: 180,
                  marginTop: 10,
                  fontSize: 11,
                }}
              >
                Change Password
              </Button>
            </Grid>
          </form>
        </Paper>
      )}
    </Grid>
  );
}
