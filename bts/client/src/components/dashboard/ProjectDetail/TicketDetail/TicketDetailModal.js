import { Card, } from '@material-ui/core';
import {useStyles} from '../../../hooks/useStyles'

export default function TicketDetailModal() {
  const classes = useStyles();
  return <Card className={classes.cardTicketDetail}></Card>;
}

