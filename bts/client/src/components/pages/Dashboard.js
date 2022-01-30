import { Grid, ThemeProvider } from '@material-ui/core';
import { Switch, Route, Redirect } from 'react-router-dom';

import { useStyles } from '../hooks/useStyles';
import theme from '../../theme';
import SideDrawer from '../layout/SideDrawer';
import ProjectDetail from '../dashboard/ProjectDetail/ProjectDetail';
import AccountSettings from '../dashboard/settings/account/AccountsSettings';
import ProjectSettings from '../dashboard/settings/project/ProjectSettings';
import ProjectList from '../dashboard/ProjectList/ProjectList';
import TicketDetail from '../dashboard/ProjectDetail/TicketDetail/TicketDetail';
import TicketList from '../dashboard/TicketList/TicketList';

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
            <div className={classes.projectContent}>
              <Switch>
                <Route path="/dashboard" exact>
                  
                  <ProjectList />
                </Route>
                <Route path="/dashboard/tickets">
                  <TicketList />
                </Route>
                <Route path="/dashboard/project/:projectId" exact>
                  <ProjectDetail />
                </Route>
                <Route
                  path="/dashboard/project/:projectId/ticket/:ticketId"
                  exact
                >
                  <TicketDetail />
                </Route>
                <Route path="/dashboard/project/:projectId/settings" exact>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ProjectSettings />
                  </Grid>
                </Route>
                <Route path="/account/settings" exact>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <AccountSettings />
                  </Grid>
                </Route>
                <Route path="/account">
                  <Redirect to="/account/settings" />
                </Route>
                <Route path="*" exact>
                  <Redirect to="/dashboard" />
                </Route>
              </Switch>
            </div>
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Dashboard;
