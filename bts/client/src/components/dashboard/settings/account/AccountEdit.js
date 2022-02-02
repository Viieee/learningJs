import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, TextField, Grid, Button } from '@material-ui/core';
// import { Image } from '@material-ui/icons';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/auth-context';
import { useStyles } from '../../../hooks/useStyles';
import useInput from '../../../hooks/useInput';
// import ImageUpload from './ImageUpload';
// import { useForm } from '../../../hooks/file-hook';

const isEmail = (value) =>
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
    value
  );
const isEmptyName = (value) => value.trim().length >= 3;
const isEmptyPassword = (value) => value.trim().length >= 7;

export default function AccountEdit({ user }) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const history = useHistory();
  // const [image, setImage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // const [formState, inputHandler] = useForm(
  //   {
  //     email: {
  //       value: '',
  //       isValid: false,
  //     },
  //     password: {
  //       value: '',
  //       isValid: false,
  //     },
  //   },
  //   false
  // );
  const {
    value: nameValue,
    isValid: nameIsValid,
    hasError: nameHasError,
    onChangeHandler: nameChangeHandler,
    onBlurHandler: nameBlurHandler,
    // reset: resetName,
    errorMessage: nameErrorMessage,
    // setErrorMessage: setNameErrorMessage
  } = useInput(isEmptyName, 'name should be longer than 3 characters', {
    value: user.userName,
    isTouched: false,
  });

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    onChangeHandler: emailChangeHandler,
    onBlurHandler: emailBlurHandler,
    // reset: resetEmail,
    errorMessage: emailErrorMessage,
    // setErrorMessage: setEmailErrorMessage,
  } = useInput(isEmail, 'email is invalid', {
    value: user.email,
    isTouched: false,
  });

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

  function submitHandler(e) {
    e.preventDefault();
    if (!emailIsValid && !passwordValid && !nameIsValid) {
      return;
    }
    fetch(`http://192.168.1.5:8080/auth/user/${user._id}`, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + auth.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: nameValue,
        email: emailValue,
        password: passwordValue,
      }),
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error('Password is invalid, please try again.');
        }
        if (res.status === 201) {
          toast.success(
            'email changed, please check your email to verify the new email before re-login.'
          );
          return auth.logout();
        }
        if (res.status === 200) {
          toast.success('username changed successfully.');
          return history.replace('/dashboard');
        }
      })
      .catch((err) => {
        setShowError(true);
        setErrorMessage(err.message);
      });
  }

  return (
    <form style={{ padding: 20 }} onSubmit={submitHandler}>
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
      {/* <Grid
        className={classes.accountSettingsForm}
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Typography>Profile Picture</Typography>
        <ImageUpload
          id="image"
          onInput={inputHandler}
          setImage={setImage}
          // imageChangeHandler={imageChangeHandler}
        />
      </Grid> */}
      <Grid
        className={classes.accountSettingsForm}
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Typography>Full Name</Typography>
        <TextField
          variant="outlined"
          placeholder="Enter your full name"
          value={nameValue}
          onChange={nameChangeHandler}
          onBlur={nameBlurHandler}
          error={nameHasError}
          helperText={nameHasError && nameErrorMessage}
          style={{ marginRight: 10 }}
        />
      </Grid>
      <Grid
        className={classes.accountSettingsForm}
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        style={{ marginTop: 20 }}
      >
        <Typography>E-mail</Typography>
        <TextField
          variant="outlined"
          placeholder="Enter e-mail"
          value={emailValue}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          error={emailHasError}
          helperText={emailHasError && emailErrorMessage}
        />
      </Grid>
      <Grid
        className={classes.accountSettingsForm}
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        style={{ marginTop: 20 }}
      >
        <Typography>Password</Typography>
        <TextField
          label="Password"
          name="password"
          variant="outlined"
          placeholder="Enter password"
          type="password"
          onChange={passwordChangeHandler}
          value={passwordValue}
          onBlur={passwordBlurHandler}
          error={passwordHasError}
          helperText={passwordHasError && passwordErrorMessage}
        />
      </Grid>
      <Grid container justify="flex-end">
        <Button type="submit" variant="outlined" color="secondary">
          save
        </Button>
      </Grid>
    </form>
  );
}
