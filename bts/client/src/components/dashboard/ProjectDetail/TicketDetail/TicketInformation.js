import { Grid, Typography, Container } from '@material-ui/core';
import { useStyles } from '../../../hooks/useStyles';
import Timer from '../../Timer/Timer';

export default function TicketInformation({ detail, deficit, devs }) {
  const classes = useStyles();
  return (
    <Container className={classes.ticketDetailCard}>
      <Typography variant="h6" style={{ marginBottom: 10 }}>
        Ticket Detail
      </Typography>

      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="flex-start"
      >
        <Typography style={{ width: '40%' }}>Ticket title</Typography>
        <Typography style={{ width: '60%' }}>{detail.title}</Typography>
        <Typography style={{ width: '40%' }}>Description</Typography>
        <Typography style={{ width: '60%' }}>{detail.description}</Typography>
        <Typography style={{ width: '40%' }}>Status</Typography>
        <Typography style={{ width: '60%' }}>{detail.status}</Typography>
        <Typography style={{ width: '40%' }}>Priority</Typography>
        <Typography style={{ width: '60%' }}>{detail.priority}</Typography>
        <Typography style={{ width: '40%' }}>Type</Typography>
        <Typography style={{ width: '60%' }}>{detail.type}</Typography>
        <Typography style={{ width: '40%' }}>Time left</Typography>
        <Typography style={{ width: '60%' }}>
          <Timer timeDeficit={deficit}></Timer>
        </Typography>
        <Typography style={{ width: '40%' }}>Assigned Devs</Typography>
        <Typography style={{ width: '60%' }}>{devs.toString()}</Typography>
        <Typography style={{ width: '40%' }}>Creator</Typography>
        <Typography style={{ width: '60%' }}>
          {detail.creator.userName}
        </Typography>
      </Grid>
    </Container>
  );
}
