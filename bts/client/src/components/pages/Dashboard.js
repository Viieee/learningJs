import { Grid,ThemeProvider  } from '@material-ui/core';
import { Switch, Route } from 'react-router-dom';
import theme from '../../theme';
import { useStyles } from '../hooks/useStyles';
import SideDrawer from '../layout/SideDrawer';
import ProjectList from '../dashboard/ProjectList/ProjectList';
import TicketList from '../dashboard/TicketList/TicketList';
import ProjectDetail from '../dashboard/ProjectDetail/ProjectDetail';

function Dashboard() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <Grid item sm={2} xs={1}>
          <SideDrawer />
        </Grid>
        <Grid item sm={10} xs={11}>
          <div className={classes.dashboardContentContainer}>
            <Switch>
              <Route path="/dashboard" exact>
                <div className={classes.projectContent}>
                  <ProjectList />
                </div>
              </Route>
              <Route path="/dashboard/tickets">
                <div className={classes.projectContent}>
                  <TicketList />
                </div>
              </Route>
              <Route path="/dashboard/project/:projectId">
                <ProjectDetail />
              </Route>
            </Switch>
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Dashboard;
