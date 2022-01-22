import React from 'react';
import {
  Container,
} from '@material-ui/core';
import { useStyles } from '../../../hooks/useStyles';
import TicketInformation from './TicketInformation';
// import TicketCommentSection from './TicketCommentSection';


export default function TicketDetail(props) {
  const classes = useStyles();

  return (
    <Container className={classes.containerTicketDetailModalBase}>
      {/* <Link component="button" onClick={closeModal}>
        <Close />
      </Link> */}
      <div className={classes.ticketDetailContent} style={{ marginTop: 10 }}>
        <TicketInformation />
        {/* <TicketCommentSection item={item} /> */}
      </div>
    </Container>
  );
}
