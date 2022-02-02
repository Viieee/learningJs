import { useContext } from 'react';
import { Button, Container, Modal, TextField, Grid } from '@material-ui/core';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/auth-context';
import { useStyles } from '../../hooks/useStyles';
import useInput from '../../hooks/useInput';

const isEmptyTitle = (value) => value.trim().length >= 3;

const NewProjectModal = (props) => {
  const auth = useContext(AuthContext);
  const classes = useStyles();

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

  function submitHandler(e) {
    e.preventDefault();
    if (!titleIsValid) {
      return;
    }
    fetch('http://192.168.1.5:8080/project/', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + auth.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: titleValue,
        description: descValue,
      }),
    })
      .then((res) => {
        if (res.status === 404) {
          return auth.logout();
        }
        if (res.status !== 201) {
          throw new Error();
        }
        return res.json();
      })
      .then((resData) => {
        auth.socket.emit('addProject', { project: resData.project });
        toast.success('New Project Added!');
        props.setOpen(false);
        resetTitle();
        resetDesc();
      })
      .catch((err) => {
        toast.error('Something went wrong, please try again.');
      });
  }

  return (
    <Modal onBackdropClick={() => props.setOpen(false)} open={props.open}>
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
  );
};

export default NewProjectModal;
