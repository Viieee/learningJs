import { Suspense, lazy } from 'react';
import { Grid, ThemeProvider } from '@material-ui/core';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useStyles } from '../hooks/useStyles';
import theme from '../../theme';

import TicketList from '../dashboard/TicketList/TicketList';

const SideDrawer = lazy(() => import('../layout/SideDrawer'));
const ProjectDetail = lazy(() =>
  import('../dashboard/ProjectDetail/ProjectDetail')
);
const AccountSettings = lazy(() =>
  import('../dashboard/settings/account/AccountsSettings')
);
const ProjectSettings = lazy(() =>
  import('../dashboard/settings/project/ProjectSettings')
);
const ProjectList = lazy(() => import('../dashboard/ProjectList/ProjectList'));
const TicketDetail = lazy(() =>
  import('../dashboard/ProjectDetail/TicketDetail/TicketDetail')
);

function Dashboard() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <Grid item sm={1} xs={1}>
          <Suspense fallback={<div />}>
            <SideDrawer />
          </Suspense>
        </Grid>
        <Grid item sm={11} xs={11}>
          <div className={classes.dashboardContentContainer}>
            <div className={classes.projectContent}>
              <Suspense fallback={<div />}>
                <Switch>
                  <Route path="/dashboard" exact>
                    <ProjectList />
                  </Route>
                  <Route path="/dashboard/tickets" exact>
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
              </Suspense>
            </div>
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Dashboard;
