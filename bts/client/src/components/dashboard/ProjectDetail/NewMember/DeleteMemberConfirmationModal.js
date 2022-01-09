import {
  Button,
  Container,
  Modal,
  Snackbar,
  //   TextField,
  Grid,
  Typography,
  Link,
} from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import { useState } from 'react';
import { useStyles } from '../../../hooks/useStyles';
import Alert from '@mui/material/Alert';

function MuiAlert(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}
export default function DeleteMemberConfirmationModal(props) {
  const classes = useStyles();
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
  }
  return (
    <>
      <Link component="button" onClick={deleteModal}>
        <DeleteOutline style={{ marginTop: 10, color: 'red' }} />
      </Link>
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
          Member Added!
        </MuiAlert>
      </Snackbar>
    </>
  );
}
