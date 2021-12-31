import NewMember from './NewMember/NewMember';
import ProjectTickets from './Tickets/ProjectTickets';
// import TicketDetail from './TicketDetail';
import { Grid, Button } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import { useStyles } from '../../hooks/useStyles';

export default function ProjectDetail() {
  const classes = useStyles();
  return (
    <div className={classes.projectDetailBase}>
      <Grid container justify="flex-end">
        <Button
          variant="outlined"
          className={classes.buttonSettingsStyleDashboard}
        >
          <MoreHoriz />
        </Button>
      </Grid>
      <div className={classes.projectTicketDetail}>
        <NewMember />
        <ProjectTickets />
      </div>
    </div>
  );
}
