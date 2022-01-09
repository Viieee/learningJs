import { Card, Typography } from '@material-ui/core';
import TicketListTable from './TicketListTable';
import { useStyles } from '../../hooks/useStyles';

function TicketList() {
  const classes = useStyles();
  return (
    <Card className={classes.cardTicket} style={{ padding: 10 }}>
      <Typography variant="h6" style={{ marginBottom: 10 }}>
        Your Assigned Tickets
      </Typography>
      <TicketListTable />
    </Card>
  );
}

export default TicketList;
