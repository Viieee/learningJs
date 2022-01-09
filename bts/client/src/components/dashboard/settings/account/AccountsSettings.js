import {
  Card,
  Divider,
  Typography,
  TextField,
  Grid,
  Button,
} from '@material-ui/core';
import { useStyles } from '../../../hooks/useStyles';
import useInput from '../../../hooks/useInput';

const isEmail = (value) =>
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
    value
  );
const isEmptyName = (value) => value.trim().length >= 3;
const isEmptyPassword = (value) => value.trim().length >= 7;

export default function AccountSettings() {
  const classes = useStyles();

  const {
    value: nameValue,
    // isValid: nameIsValid,
    hasError: nameHasError,
    onChangeHandler: nameChangeHandler,
    onBlurHandler: nameBlurHandler,
    // reset: resetName,
    errorMessage: nameErrorMessage,
    // setErrorMessage: setNameErrorMessage
  } = useInput(isEmptyName, 'name should be longer than 3 characters');

  const {
    value: emailValue,
    // isValid: emailIsValid,
    hasError: emailHasError,
    onChangeHandler: emailChangeHandler,
    onBlurHandler: emailBlurHandler,
    // reset: resetEmail,
    errorMessage: emailErrorMessage,
    // setErrorMessage: setEmailErrorMessage,
  } = useInput(isEmail, 'email is invalid');

  const {
    value: currentPasswordValue,
    // isValid: currentPasswordValid,
    hasError: currentPasswordHasError,
    onChangeHandler: currentPasswordChangeHandler,
    onBlurHandler: currentPasswordBlurHandler,
    // reset: resetCurrentPassword,
    errorMessage: currentPasswordErrorMessage,
    // setErrorMessage: setCurrentPasswordErrorMessage,
  } = useInput(
    isEmptyPassword,
    'password length should be more than 7 characters'
  );

  const {
    value: passwordValue,
    // isValid: passwordValid,
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
  return (
    <Card className={classes.cardSettingsBase}>
      <Typography variant="h6">Account Settings</Typography>
      <Divider />
      <form style={{ padding: 20 }}>
        <Grid
          className={classes.accountSettingsForm}
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Typography>Full Name</Typography>
          <TextField
            label="Full Name"
            name="fullName"
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
            label="E-mail"
            name="email"
            variant="outlined"
            placeholder="Enter e-mail"
            value={emailValue}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            error={emailHasError}
            helperText={emailHasError && emailErrorMessage}
          />
        </Grid>
        <Grid container justify="flex-end">
          <Button type="submit" variant="outlined" color="secondary">
            save
          </Button>
        </Grid>
      </form>
      <Divider />
      <Typography variant="h6" style={{ marginTop: 10 }}>
        Password Change
      </Typography>
      <form style={{ padding: 20 }}>
        <Grid
          className={classes.accountSettingsForm}
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Typography>Current Password</Typography>
          <TextField
            label="Password"
            name="password"
            variant="outlined"
            placeholder="Enter password"
            type="password"
            onChange={currentPasswordChangeHandler}
            value={currentPasswordValue}
            onBlur={currentPasswordBlurHandler}
            error={currentPasswordHasError}
            helperText={currentPasswordHasError && currentPasswordErrorMessage}
            style={{ maxWidth: 350, minWidth: 350, marginRight: 15 }}
          />
        </Grid>
        <Divider style={{ marginBottom: 10, marginTop: 20 }} />
        <Grid
          className={classes.accountSettingsForm}
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Typography>New Password</Typography>
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
            style={{ maxWidth: 350, minWidth: 350 }}
          />
        </Grid>
        <Grid
          className={classes.accountSettingsForm}
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          style={{ marginTop: 10 }}
        >
          <Typography>Confirm Password</Typography>
          <TextField
            variant="outlined"
            label="Confirm Password"
            placeholder="Confirm your password"
            name="confirmPassword"
            type="password"
            value={confirmPasswordValue}
            onChange={confirmPasswordChangeHandler}
            onBlur={confirmPasswordBlurHandler}
            error={confirmPasswordHasError}
            helperText={confirmPasswordHasError && confirmPasswordErrorMessage}
            style={{ maxWidth: 350, minWidth: 350, marginRight: 15 }}
          />
        </Grid>
        <Grid container justify="flex-end">
          <Button type="submit" variant="outlined" color="secondary">
            save
          </Button>
        </Grid>
      </form>
      {/*
 
        <Grid
          className={classes.accountSettingsForm}
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          style={{ marginTop: 20 }}
        >
          
          
        </Grid>
        <Grid container justify="flex-end">
          <Button type="submit" variant="outlined" color="secondary">
            save
          </Button>
        </Grid>
      </form> */}
    </Card>
  );
}
