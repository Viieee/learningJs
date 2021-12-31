import { Card} from '@material-ui/core';
import ProjectTicketsTable from './ProjectTicketsTable';
import {useStyles} from '../../../hooks/useStyles'

function ProjectTickets() {
  const classes = useStyles();
  return (
    <Card className={classes.cardProjectTicket}>
      <ProjectTicketsTable />
    </Card>
  );
}

export default ProjectTickets;
