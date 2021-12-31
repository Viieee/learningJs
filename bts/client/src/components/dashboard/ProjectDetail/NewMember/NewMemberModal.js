import {
  Button,
  Container,
  Modal,
  Snackbar,
  TextField,
  Grid,
} from '@material-ui/core';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import useInput from '../../../hooks/useInput';
import {useStyles} from '../../../hooks/useStyles'

const isEmail = (value) =>
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
    value
  );

function MuiAlert(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}

export default function NewMemberModal(props) {
  const classes = useStyles();
  const [openAlert, setOpenAlert] = useState(false);
  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    onChangeHandler: emailChangeHandler,
    onBlurHandler: emailBlurHandler,
    reset: resetEmail,
    errorMessage: emailErrorMessage,
    // setErrorMessage: setEmailErrorMessage,
  } = useInput(isEmail, 'email is invalid');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  function submitHandler(e) {
    e.preventDefault();
    if (!emailIsValid) {
      return;
    }
    console.log(emailValue);
    setOpenAlert(true);
    props.setOpen(false);
    resetEmail();
  }
  return (
    <>
      <Modal open={props.open}>
        <Container className={classes.containerNewMemberModal}>
          <form
            className={classes.formNewMemberModal}
            autoComplete="off"
            onSubmit={submitHandler}
          >
            <div className={classes.itemNewMemberModal}>
              <TextField
                id="standard-basic"
                label="E-mail"
                variant="outlined"
                name="email"
                placeholder="Enter e-mail"
                value={emailValue}
                onChange={emailChangeHandler}
                onBlur={emailBlurHandler}
                error={emailHasError}
                helperText={emailHasError && emailErrorMessage}
                size="small"
                style={{ width: '100%' }}
              />
            </div>
            <div className={classes.itemNewMemberModal}>
              <Grid container justify="flex-end">
                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                  style={{ marginRight: 20 }}
                >
                  Add
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => props.setOpen(false)}
                >
                  Cancel
                </Button>
              </Grid>
            </div>
          </form>
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
