import { useState, useContext } from 'react';
import {
  Button,
  Container,
  Modal,
  Snackbar,
  Grid,
  Typography,
  Link,
} from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import Alert from '@mui/material/Alert';
import { AuthContext } from '../../../context/auth-context';
import { useStyles } from '../../../hooks/useStyles';

function MuiAlert(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}
export default function DeleteKey(props) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
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
  function confirmDeletionHandler() {
    // /:projectId/apiKey
    fetch(
      process.env.NODE_ENV === 'development'
        ? `http://192.168.1.9:8080/project/${props.projectId}/apiKey`
        : `https://protected-basin-15687.herokuapp.com/project/${props.projectId}/apiKey`,
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
        // history.push('/dashboard');
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  }
  return (
    <>
      <Link component="button" onClick={deleteModal}>
        <DeleteOutline
          style={{ color: 'red', marginLeft: 20, marginBottom: 12 }}
        />
      </Link>
      <Modal onBackdropClick={() => setOpen(false)} open={open}>
        <Container
          className={classes.containerNewMemberModal}
          style={{ height: 'max-content', width: 325 }}
        >
          <Grid container justify="flex-end">
            <Typography style={{ marginBottom: 30 }}>
              Are you sure you want to delete the API Key?
            </Typography>
            <Button
              onClick={confirmDeletionHandler}
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
          deleted!
        </MuiAlert>
      </Snackbar>
    </>
  );
}
