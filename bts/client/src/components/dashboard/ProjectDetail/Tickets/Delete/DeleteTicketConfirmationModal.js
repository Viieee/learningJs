import { useState, useContext } from 'react';
import {
  Button,
  Container,
  Modal,
  Grid,
  Typography,
  ListItemIcon,
  MenuItem,
} from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../../context/auth-context';
import { useStyles } from '../../../../hooks/useStyles';

export default function DeleteTicketConfirmationModal(props) {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  function deleteModal() {
    setOpen(true);
  }
  function confirmedDeletion(ticket) {
    fetch(`http://192.168.1.5:8080/ticket/${ticket._id}`, {
      method: 'DELETE',
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
        auth.socket.emit('deleteTicket', { ticket: resData.ticket });
        setOpen(false);
        props.setAnchorOptions(null);
        return toast.success('ticket deleted!');
      })
      .catch((err) => {
        toast.error('something went wrong.');
      });
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
            <Typography
              style={{
                marginBottom: 30,
                marginRight: 30,
              }}
            >
              Are you sure you want to delete this ticket?
            </Typography>
            <Button
              onClick={() => {
                confirmedDeletion(props.ticket);
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
    </>
  );
}
