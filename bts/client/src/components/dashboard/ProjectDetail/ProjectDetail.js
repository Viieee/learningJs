import { useEffect, useContext, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthContext } from '../../context/auth-context';
import { useStyles } from '../../hooks/useStyles';
import Members from './Members/Members';
import ProjectTickets from './Tickets/ProjectTickets';
import ProjectDetailSettingsDropdown from '../dropdowns/ProjectDetailSettingsDropdown';

export default function ProjectDetail() {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const params = useParams();
  const history = useHistory();
  const { projectId } = params;
  const [projectDetail, setProjectDetail] = useState(null);

  useEffect(() => {
    fetch(`http://192.168.1.5:8080/project/${projectId}`, {
      headers: {
        Authorization: 'Bearer ' + auth.token,
      },
    })
      .then((res) => {
        if (res.status === 404 || res.status === 500 || res.status === 401) {
          history.push('/dashboard');
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData.project);
        setProjectDetail(resData.project);
      })
      .catch((err) => {});
  }, [auth.token, history, projectId, auth.userId]);

  useEffect(() => {
    auth.socket.emit('joinRoom', { username: auth.userId, room: projectId });
  }, [auth.socket, auth.userId, projectId]);

  return (
    <div className={classes.projectDetailBase}>
      {projectDetail && (
        <div>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">{projectDetail.title}</Typography>
            <ProjectDetailSettingsDropdown projectDetail={projectDetail} />
          </Grid>
          <div className={classes.projectTicketDetail}>
            <Members projectDetail={projectDetail} />
            <ProjectTickets projectDetail={projectDetail} />
          </div>
        </div>
      )}
      {!projectDetail && (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Grid>
      )}
    </div>
  );
}
