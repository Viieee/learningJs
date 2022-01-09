import { Grid, Typography, Container } from '@material-ui/core';
import { useStyles } from '../../../hooks/useStyles';
import Timer from '../../Timer/Timer';
export default function TicketInformation(props) {
  const classes = useStyles();
  let startDate = new Date();
  let endDate = props.item.dateEnd;
  let startDateTotal = Math.floor(startDate.getTime() / 1000);

  let endDateTotal = Math.floor(endDate.getTime() / 1000);

  if (endDate.getDate() < startDate.getDate()) {
    endDateTotal = 0;
  }

  const timeDeficit = endDateTotal - startDateTotal;
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
        <Typography style={{ width: '60%' }}>{props.item.title}</Typography>
        <Typography style={{ width: '40%' }}>Description</Typography>
        <Typography style={{ width: '60%' }}>
          {props.item.description}
        </Typography>
        <Typography style={{ width: '40%' }}>Status</Typography>
        <Typography style={{ width: '60%' }}>{props.item.status}</Typography>
        <Typography style={{ width: '40%' }}>Priority</Typography>
        <Typography style={{ width: '60%' }}>{props.item.priority}</Typography>
        <Typography style={{ width: '40%' }}>Type</Typography>
        <Typography style={{ width: '60%' }}>{props.item.type}</Typography>
        <Typography style={{ width: '40%' }}>Time left</Typography>
        <Typography style={{ width: '60%' }}>
          <Timer timeDeficit={timeDeficit}></Timer>
        </Typography>
        <Typography style={{ width: '40%' }}>Assigned Devs</Typography>
        <Typography style={{ width: '60%' }}>
          {props.item.assignedDevs.toString()}
        </Typography>
        <Typography style={{ width: '40%' }}>Creator</Typography>
        <Typography style={{ width: '60%' }}>{props.item.author}</Typography>
      </Grid>
    </Container>
  );
}
