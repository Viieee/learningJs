import { Suspense, lazy } from 'react';
import { Card, Typography } from '@material-ui/core';
import { useStyles } from '../../hooks/useStyles';
// import TicketListTable from './TicketListTable';

const TicketListTable = lazy(() => import('./TicketListTable'));

export default function TicketList() {
  const classes = useStyles();
  return (
    <Card className={classes.cardTicket} style={{ padding: 10 }}>
      <Typography variant="h6" style={{ marginBottom: 10 }}>
        Your Assigned Tickets
      </Typography>
      <Suspense fallback={<div> Loading . . .</div>}>
        <TicketListTable />
      </Suspense>
    </Card>
  );
}
