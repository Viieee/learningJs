import { Card } from '@material-ui/core';
import { useStyles } from '../../../hooks/useStyles';
import ProjectTicketsTable from './Table/ProjectTicketsTable';

function ProjectTickets(props) {
  const classes = useStyles();
  const { projectDetail, role, setProjectTickets, projectTickets } = props;
  return (
    <Card className={classes.cardProjectTicket}>
      <ProjectTicketsTable
        projectDetail={projectDetail}
        role={role}
        projectTickets={projectTickets}
        setProjectTickets={setProjectTickets}
      />
    </Card>
  );
}

export default ProjectTickets;
