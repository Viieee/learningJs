import {
  Button,
  Container,
  Modal,
  Snackbar,
  Grid,
  Typography,
  ListItemIcon,
  MenuItem,
} from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import { useState } from 'react';
import { useStyles } from '../../hooks/useStyles';
import Alert from '@mui/material/Alert';
import { useHistory } from 'react-router-dom';

function MuiAlert(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}
export default function DeleteTicketConfirmationModal(props) {
  const classes = useStyles();
  let history = useHistory();
  const [openAlert, setOpenAlert] = useState(false);
  const [open, setOpen] = useState(false);
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
    console.log(item);
    // <Redirect to="/" />;
    history.push('/dashboard');
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
          Member Added!
        </MuiAlert>
      </Snackbar>
    </>
  );
}
