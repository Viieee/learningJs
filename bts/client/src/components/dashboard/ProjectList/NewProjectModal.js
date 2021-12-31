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
import useInput from '../../hooks/useInput';
import {useStyles} from '../../hooks/useStyles'


function MuiAlert(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}

const isEmptyTitle = (value) => value.trim().length >= 3;

const NewProjectModal = (props) => {
  const classes = useStyles();
  const [openAlert, setOpenAlert] = useState(false);

  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    onChangeHandler: titleChangeHandler,
    onBlurHandler: titleBlurHandler,
    reset: resetTitle,
    errorMessage: titleErrorMessage,
    // setErrorMessage: setNameErrorMessage
  } = useInput(isEmptyTitle, 'title should be longer than 3 characters');

  const {
    value: descValue,
    // isValid: descIsValid,
    // hasError: descHasError,
    onChangeHandler: descChangeHandler,
    onBlurHandler: descBlurHandler,
    reset: resetDesc,
    // errorMessage: descErrorMessage,
    // setErrorMessage: setNameErrorMessage
  } = useInput(isEmptyTitle, 'name should be longer than 3 characters');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  function submitHandler(e) {
    e.preventDefault();
    if (!titleIsValid) {
      return;
    }
    setOpenAlert(true);
    props.setOpen(false);
    resetTitle();
    resetDesc();
  }

  return (
    <>
      <Modal open={props.open}>
        <Container className={classes.containerNewProjectModal}>
          <form
            className={classes.formNewProjectModal}
            autoComplete="off"
            onSubmit={submitHandler}
          >
            <div className={classes.itemNewProjectModal}>
              <TextField
                required
                name="title"
                value={titleValue}
                onChange={titleChangeHandler}
                onBlur={titleBlurHandler}
                error={titleHasError}
                helperText={titleHasError && titleErrorMessage}
                id="standard-basic"
                label="Project Title"
                size="small"
                style={{ width: '100%' }}
              />
            </div>
            <div className={classes.itemNewProjectModal}>
              <TextField
                name="description"
                value={descValue}
                onChange={descChangeHandler}
                onBlur={descBlurHandler}
                id="outlined-multiline-static"
                multiline
                rows={4}
                defaultValue="Tell your story..."
                variant="outlined"
                label="Description"
                size="small"
                style={{ width: '100%' }}
              />
            </div>
            <div className={classes.itemNewProjectModal}>
              <Grid container justify="flex-end">
                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                  style={{ marginRight: 20 }}
                >
                  Create
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
          Project Created!
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default NewProjectModal;
