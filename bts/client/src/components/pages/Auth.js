import { Link } from 'react-router-dom';
import { Paper, Grid, Tabs, Tab } from '@material-ui/core/';
import BugReport from '@material-ui/icons/BugReport';
import { useStyles } from '../hooks/useStyles';
import TabPanel from '../layout/TabPanel';
import Signin from '../auth/Signin';
import Signup from '../auth/Signup';

const Auth = (props) => {
  const classes = useStyles();
  let value = props.value;
  return (
    <Grid>
      <Paper elevation={20} className={classes.paperStyle}>
        <Grid container justify="center">
          <h2 style={{ padding: 10 }}>
            <BugReport /> Bug Tracking System
          </h2>
        </Grid>
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
