import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  IconButton,
  Modal,
  Container,
  Grid,
  Typography,
  Button,
} from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import { AuthContext } from '../../../../context/auth-context';
import { useStyles } from '../../../../hooks/useStyles';
export default function DeleteCommentModal({ commentId }) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const params = useParams();
  const { ticketId } = params;
  const [open, setOpen] = useState(false);
  function confirmDeletion() {
    // /:projectId/apiKey
    fetch(`http://192.168.1.5:8080/ticket/${ticketId}/comment/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + auth.token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        auth.socket.emit('deleteComment', { comment: resData.comment });
      })
      .catch((err) => console.log(err));
  }
  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <DeleteOutline style={{ color: 'red' }} />
      </IconButton>
      <Modal onBackdropClick={() => setOpen(false)} open={open}>
        <Container
          className={classes.containerNewMemberModal}
          style={{ height: 'max-content' }}
        >
          <Grid container justify="flex-end">
            <Typography style={{ marginBottom: 30 }}>
              Are you sure you want to delete this comment?
            </Typography>
            <Button
              onClick={confirmDeletion}
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
