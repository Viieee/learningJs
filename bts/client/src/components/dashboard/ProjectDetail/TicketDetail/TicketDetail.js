import { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Grid } from '@material-ui/core';
import CircularProgress from '@mui/material/CircularProgress';
import { useStyles } from '../../../hooks/useStyles';
import TicketInformation from './TicketInformation';
import Comments from './CommentSection/Comments';
import { AuthContext } from '../../../context/auth-context';

export default function TicketDetail(props) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const params = useParams();
  const history = useHistory();
  const { ticketId } = params;
  const [detail, setDetail] = useState(null);
  const [deficit, setDeficit] = useState(null);
  const [devs, setDevs] = useState([]);
  useEffect(() => {
    fetch(`http://192.168.1.2:8080/ticket/${ticketId}`, {
      headers: {
        Authorization: 'Bearer ' + auth.token,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          history.replace('/dashboard');
        }
        return res.json();
      })
      .then((resData) => {
        setDetail(resData.ticket);
        let devs = [];
        for (var dev of resData.ticket.assignedDevs) {
          devs.push(dev.userName);
        }
        setDevs(devs);
        let startDate = new Date();
        let endDate = new Date(resData.ticket.timeEnd);
        let startDateTotal = Math.floor(startDate.getTime() / 1000);
        let endDateTotal = Math.floor(endDate.getTime() / 1000);

        if (endDateTotal < startDateTotal) {
          endDateTotal = 0;
        }
        const timeDeficit = endDateTotal - startDateTotal;
        setDeficit(timeDeficit);
      })
      .catch((err) => {});
  }, [auth, ticketId, history]);
  return (
    <Container className={classes.containerTicketDetailModalBase}>
      {!detail && (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Grid>
      )}
      {detail && deficit && (
        <div className={classes.ticketDetailContent} style={{ marginTop: 10 }}>
          <TicketInformation detail={detail} deficit={deficit} devs={devs} />
          <Comments comments={detail.comments}/>
        </div>
      )}
    </Container>
  );
}
