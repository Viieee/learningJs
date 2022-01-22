import {
  Divider,
  Typography,
  TextField,
  Grid,
  Button,
} from '@material-ui/core';
import { useStyles } from '../../../hooks/useStyles';
import useInput from '../../../hooks/useInput';

const isEmptyPassword = (value) => value.trim().length >= 7;
export default function PasswordEdit() {
  const classes = useStyles();
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
    value: newPasswordValue,
    // isValid: newPasswordValid,
    hasError: newPasswordHasError,
    onChangeHandler: newPasswordChangeHandler,
    onBlurHandler: newPasswordBlurHandler,
    // reset: resetNewPassword,
    errorMessage: newPasswordErrorMessage,
    // setErrorMessage: setNewPasswordErrorMessage,
  } = useInput(
    isEmptyPassword,
    'password length should be more than 7 characters'
  );

  // confirm validation
  const isValidConfirmPassword = (value) => value === newPasswordValue;

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
          onChange={newPasswordChangeHandler}
          value={newPasswordValue}
          onBlur={newPasswordBlurHandler}
          error={newPasswordHasError}
          helperText={newPasswordHasError && newPasswordErrorMessage}
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
  );
}
