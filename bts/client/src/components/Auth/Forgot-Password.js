import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  makeStyles,
  // createTheme,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Link as RouterLink } from 'react-router-dom';
import BugReport from '@material-ui/icons/BugReport';

// the styling
const useStyles = makeStyles((theme) => ({
  paperStyle: {
    width: 340,
    height: 436.5,
    position: 'absolute',
    left: '50%',
    top: '40%',
    transform: 'translate(-50%, -50%)',
    padding: '5px 0 0 5px',
    [theme.breakpoints.between(0, 400)]: {
      top: '45%',
    },
  },
  fieldStyle: {
    width: 260,
    margin: '0 30px',
    padding: '2px 0',
  },
  headerStyle: {
    textAlign: 'center',
    margin: '10px 0',
  },
  logoStyle: {
    textAlign: 'center',
    marginTop: '115px',
    [theme.breakpoints.between(0, 400)]: {
      marginTop: '50px',
    },
  },
  buttonStyle: {
    width: 100,
    margin: '25px 43px 0 auto',
    display: 'block',
  },
}));

function ForgotPassword() {
  const classes = useStyles();

  return (
    <Grid>
      <div className={classes.logoStyle}>
        <h2>
          <BugReport /> Bug Tracking System
        </h2>
      </div>
      <Paper elevation={20} className={classes.paperStyle}>
        <Grid align="left">
          <Link component={RouterLink} to="/signin">
            <CloseIcon />
          </Link>
        </Grid>
        <div className={classes.headerStyle}>
          <h2>Password Reset</h2>
          <Typography variant="caption" gutterBottom>
            Please fill this form so we can send you the password reset link to
            your e-mail !
          </Typography>
        </div>
        <form>
          <TextField
            label="Email"
            placeholder="Enter your email"
            className={classes.fieldStyle}
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
