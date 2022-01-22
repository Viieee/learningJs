import { Switch, Route, Redirect } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import ProjectDetail from '../dashboard/ProjectDetail/ProjectDetail';
import AccountSettings from '../dashboard/settings/account/AccountsSettings';
import ProjectSettings from '../dashboard/settings/project/ProjectSettings';
import ProjectList from '../dashboard/ProjectList/ProjectList';
import TicketDetail from '../dashboard/ProjectDetail/TicketDetail/TicketDetail';
import TicketList from '../dashboard/TicketList/TicketList';
export default function Project() {
  return (
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
      <Route path="/dashboard/project/:projectId/ticket/:ticketId" exact>
        <TicketDetail />
      </Route>
      <Route path="/dashboard/project/:projectId/settings">
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
      <Route path="*">
        <Redirect to="/dashboard" />
      </Route>
    </Switch>
  );
}
