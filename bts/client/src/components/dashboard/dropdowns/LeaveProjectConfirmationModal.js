import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Container,
  Modal,
  Grid,
  Typography,
  ListItemIcon,
  MenuItem,
} from '@material-ui/core';
import { ExitToApp as Logout } from '@material-ui/icons';
import { toast } from 'react-toastify';
import { useStyles } from '../../hooks/useStyles';
import { AuthContext } from '../../context/auth-context';

export default function LeaveProjectConfirmationModal(props) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const { projectDetail } = props;
  function deleteModal() {
    setOpen(true);
  }

  function leaveProjectHandler() {
    fetch(`http://192.168.1.5:8080/project/${projectDetail._id}/leave`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + auth.token,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('error happened!');
        }
        return res.json();
      })
      .then((resData) => {
        toast.success('left project');
        return history.replace('/dashboard');
      })
      .catch((err) => {
        toast.error('something went wrong');
      });
  }
  return (
    <>
      <MenuItem style={{ color: 'red' }} onClick={deleteModal}>
        <ListItemIcon>
          <Logout style={{ color: 'red' }} />
        </ListItemIcon>
        Leave
      </MenuItem>
      <Modal onBackdropClick={() => setOpen(false)} open={open}>
        <Container
          className={classes.containerNewMemberModal}
          style={{ height: 'max-content' }}
        >
          <Grid container justify="flex-end">
            <Typography
              style={{
                marginBottom: 30,
                marginRight: 30,
              }}
            >
              Are you sure you want to leave this project?
            </Typography>
            <Button
              onClick={leaveProjectHandler}
              variant="outlined"
              color="primary"
              style={{ marginRight: 20 }}
            >
              Yes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </Grid>
        </Container>
      </Modal>
    </>
  );
}
