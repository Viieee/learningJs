import { Grid, Typography, Container } from '@material-ui/core';
import { useStyles } from '../../../hooks/useStyles';
export default function TicketCommentSection(props) {
    const classes = useStyles()
  return (
    <Container className={classes.ticketDetailCard}>
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="flex-start"
      >
        <Typography>Ticket title</Typography>
        <Typography>{props.item.title}</Typography>
      </Grid>
    </Container>
  );
}
