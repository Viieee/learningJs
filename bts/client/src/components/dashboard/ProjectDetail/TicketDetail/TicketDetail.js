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
  const [comments, setComments] = useState(null);
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    auth.socket.emit('joinRoom', { username: auth.userId, room: ticketId });
  }, [auth.socket, auth.userId, ticketId]);

  useEffect(() => {
    fetch(`http://192.168.1.5:8080/ticket/${ticketId}`, {
      headers: {
        Authorization: 'Bearer ' + auth.token,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 404 || res.status === 500) {
          history.replace('/dashboard');
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData.ticket.comments);
        setDetail(resData.ticket);
        setComments(resData.ticket.comments);
        // console.log(comments);
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
          <Comments comments={comments} setComments={setComments} />
        </div>
      )}
    </Container>
  );
}
