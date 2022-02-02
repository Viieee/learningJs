import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Container,
  Modal,
  Snackbar,
  Grid,
  Typography,
  // Link,
  ListItemIcon,
  MenuItem,
} from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import Alert from '@mui/material/Alert';
import { useStyles } from '../../../../hooks/useStyles';
import { AuthContext } from '../../../../context/auth-context';

function MuiAlert(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}
export default function DeleteMemberConfirmationModal(props) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [openAlert, setOpenAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const { projectId } = params;
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };
  function deleteModal() {
    setOpen(true);
  }
  function confirmedDeletion(item) {
    // /:projectId/apiKey
    fetch(
      `http://192.168.1.5:8080/project/${projectId}/member/${props.item._id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + auth.token,
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        auth.socket.emit('deleteMemberList', { member: resData.userId });
        // history.push('/dashboard');
        // window.location.reload(false);
      })
      .catch((err) => console.log(err));
  }
  return (
    <>
      <MenuItem style={{ color: 'red' }} onClick={deleteModal}>
        <ListItemIcon>
          <DeleteOutline style={{ color: 'red' }} />
        </ListItemIcon>
        Delete
      </MenuItem>
      <Modal onBackdropClick={() => setOpen(false)} open={open}>
        <Container
          className={classes.containerNewMemberModal}
          style={{ height: 'max-content' }}
        >
          <Grid container justify="flex-end">
            <Typography style={{ marginBottom: 30 }}>
              Are you sure you want to delete this user from the project?
            </Typography>
            <Button
              onClick={() => {
                confirmedDeletion(props.item);
              }}
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
      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MuiAlert onClose={handleClose} severity="success">
          Member deleted
        </MuiAlert>
      </Snackbar>
    </>
  );
}
