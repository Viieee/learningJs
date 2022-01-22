import { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, Typography, Container } from '@material-ui/core';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthContext } from '../../../context/auth-context';
import { useStyles } from '../../../hooks/useStyles';
import Timer from '../../Timer/Timer';

export default function TicketInformation(props) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const params = useParams();
  const history = useHistory();
  const { ticketId } = params;
  console.log(ticketId);
  const [detail, setDetail] = useState(null);
  const [deficit, setDeficit] = useState(null);
  const [devs, setDevs] = useState([]);
  useEffect(() => {
    fetch(`http://192.168.1.5:8080/ticket/${ticketId}`, {
      headers: {
        Authorization: 'Bearer ' + auth.token,
      },
    })
      .then((res) => {
        console.log(res.status);
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

        // var vals = testArray.map(function(a) {return a.val;});

        if (endDateTotal < startDateTotal) {
          endDateTotal = 0;
        }
        const timeDeficit = endDateTotal - startDateTotal;
        console.log(new Date(resData.ticket.timeEnd));
        console.log(timeDeficit);
        setDeficit(timeDeficit);
      })
      .catch((err) => {});
  }, [auth, ticketId, history]);

  return (
    <Container className={classes.ticketDetailCard}>
      <Typography variant="h6" style={{ marginBottom: 10 }}>
        Ticket Detail
      </Typography>
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
      )}
    </Container>
  );
}
