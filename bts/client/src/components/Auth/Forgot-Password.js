import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Link as RouterLink } from 'react-router-dom';
import { useStyles } from '../hooks/useStyles';
import useInput from '../hooks/useInput';

// validation
const isEmail = (value) => /$^|.+@.+..+/.test(value);

function ForgotPassword() {
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

  function submitHandler(e) {
    e.preventDefault();
    if (!emailIsValid) {
      return;
    }
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
