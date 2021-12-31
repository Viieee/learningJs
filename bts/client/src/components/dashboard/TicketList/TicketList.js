import { Card} from '@material-ui/core';
import TicketListTable from './TicketListTable';
import {useStyles} from '../../hooks/useStyles'

function TicketList() {
  const classes = useStyles();
  return (
    <Card className={classes.cardTicket}>
      <TicketListTable />
    </Card>
  );
}

export default TicketList;
