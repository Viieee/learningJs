import { Paper, Grid, Tabs, Tab, makeStyles } from '@material-ui/core/';
import TabPanel from '../layout/TabPanel';
import Signin from '../auth/Signin';
import Signup from '../auth/Signup';
import { Link } from 'react-router-dom';
import BugReport from '@material-ui/icons/BugReport';

// styling
const useStyles = makeStyles((theme) => ({
  paperStyle: {
    width: 340,
    position: 'absolute',
    left: '50%',
    top: '40%',
    transform: 'translate(-50%, -50%)',
    [theme.breakpoints.between(0, 400)]: {
      top: '45%',
    },
  },
  logoStyle: {
    textAlign: 'center',
    marginTop: '115px',
    [theme.breakpoints.between(0, 400)]: {
      marginTop: '50px',
    },
  },
}));

const Auth = (props) => {
  const classes = useStyles();
  let value = props.value;

  return (
    <Grid>
      <div className={classes.logoStyle}>
        <h2>
          <BugReport /> Bug Tracking System
        </h2>
      </div>
      <Paper elevation={20} className={classes.paperStyle}>
        <Grid container justify="center">
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            aria-label="disabled tabs example"
          >
            <Tab label="Sign In" value="signin" component={Link} to="/signin" />
            <Tab label="Sign Up" value="signup" component={Link} to="/signup" />
          </Tabs>
        </Grid>
        <TabPanel value={value} index={'signin'}>
          <Signin />
        </TabPanel>
        <TabPanel value={value} index={'signup'}>
          <Signup />
        </TabPanel>
      </Paper>
    </Grid>
  );
};

export default Auth;
