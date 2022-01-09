import NewMember from './NewMember/NewMember';
import ProjectTickets from './Tickets/ProjectTickets';
// import TicketDetail from './TicketDetail';
import { Grid } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { useStyles } from '../../hooks/useStyles';
import ProjectDetailSettingsDropdown from '../dropdowns/ProjectDetailSettingsDropdown';

export default function ProjectDetail() {
  const classes = useStyles();
  // const params = useParams();
  // const { projectId } = params;
  const location = useLocation();
  const { item } = location.state;
  console.log(item);
  // console.log(props);
  return (
    <div className={classes.projectDetailBase}>
      <Grid container justify="flex-end">
        <ProjectDetailSettingsDropdown item={item} />
      </Grid>
      <div className={classes.projectTicketDetail}>
        <NewMember />
        <ProjectTickets />
      </div>
    </div>
  );
}
