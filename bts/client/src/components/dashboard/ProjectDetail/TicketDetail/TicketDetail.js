import {
  // Modal,
  Container,
  // Link,
  // TableCell
} from '@material-ui/core';
import { useStyles } from '../../../hooks/useStyles';
// import { Close } from '@material-ui/icons';
import {
  // useParams,
  useLocation,
} from 'react-router-dom';
import TicketInformation from './TicketInformation';
import React from 'react';
import TicketCommentSection from './TicketCommentSection';

export default function TicketDetail(props) {
  const classes = useStyles();
  const location = useLocation();
  const { item } = location.state;

  return (
    <Container className={classes.containerTicketDetailModalBase}>
      {/* <Link component="button" onClick={closeModal}>
        <Close />
      </Link> */}
      <div className={classes.ticketDetailContent} style={{ marginTop: 10 }}>
        <TicketInformation item={item} />
        <TicketCommentSection item={item} />
      </div>
    </Container>
  );
}
