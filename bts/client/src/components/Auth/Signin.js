import { useState, useContext } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  IconButton,
  InputAdornment,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { AuthContext } from '../context/auth-context';
import { useStyles } from '../hooks/useStyles';
import useInput from '../hooks/useInput';

// validation
const isEmail = (value) =>
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
    value
  );
const isEmpty = (value) => value.trim().length >= 7;

function Signin() {
  const classes = useStyles();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    onChangeHandler: emailChangeHandler,
    onBlurHandler: emailBlurHandler,
    reset: resetEmail,
    errorMessage: emailErrorMessage,
    // setErrorMessage: setEmailErrorMessage,
    // setHasError: setEmailHasError,
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
  } = useInput(isEmpty, 'password should be longer than 7 characters');

  function submitHandler(e) {
    e.preventDefault();
    if (!emailIsValid && !passwordValid) {
      return;
    }
    fetch('http://192.168.1.5:8080/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailValue.toLowerCase(),
        password: passwordValue,
      }),
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error('Email or password is invalid, please try again.');
        }
        if (res.status === 404) {
          throw new Error('Email is not registered');
        }
        if (res.status === 403) {
          throw new Error(
            "Account hasn't been verified yet, please check your email to verify before trying again."
          );
        }
        if (res.status === 500) {
          throw new Error('Something went wrong');
        }
        return res.json();
      })
      .then((resData) => {
        auth.login(resData.userId,resData.token);
        resetEmail();
        resetPassword();
        history.replace('/dashboard');
      })
      .catch((err) => {
        setShowError(true);
        setErrorMessage(err.message);
      });
  }

  return (
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
        <form onSubmit={submitHandler}>
          <TextField
            label="E-mail"
            variant="outlined"
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
            required
            style={{ marginTop: 10 }}
            label="Password"
            variant="outlined"
            placeholder="Enter password"
            type={showPassword ? 'text' : 'password'} // <-- This is where the magic happens
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
          />
          <Button
            type="submit"
            color="primary"
            className={classes.btnstyle}
            // style={{ marginTop: 50 }}
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
