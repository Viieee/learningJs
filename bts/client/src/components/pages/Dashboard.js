import { Grid, ThemeProvider } from '@material-ui/core';
import { Switch, Route } from 'react-router-dom';
import theme from '../../theme';
import { useStyles } from '../hooks/useStyles';
import SideDrawer from '../layout/SideDrawer';
import Project from './Project';

function Dashboard() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <Grid item sm={1} xs={1}>
          <SideDrawer />
        </Grid>
        <Grid item sm={11} xs={11}>
          <div className={classes.dashboardContentContainer}>
            <Switch>
              <Route path="/dashboard">
                <div className={classes.projectContent}>
                  <Project/>
                </div>
              </Route>
            </Switch>
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Dashboard;
