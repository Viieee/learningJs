import { Card } from '@material-ui/core';
import { useStyles } from '../../../hooks/useStyles';
import ProjectTicketsTable from './Table/ProjectTicketsTable';

function ProjectTickets(props) {
  const classes = useStyles();
  const { projectDetail } = props;
  return (
    <Card className={classes.cardProjectTicket}>
      <ProjectTicketsTable projectDetail={projectDetail}/>
    </Card>
  );
}

export default ProjectTickets;
