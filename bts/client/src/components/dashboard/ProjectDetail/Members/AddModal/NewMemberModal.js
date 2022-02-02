import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Modal, TextField, Grid } from '@material-ui/core';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../../context/auth-context';
import { useStyles } from '../../../../hooks/useStyles';
import useInput from '../../../../hooks/useInput';

const isEmail = (value) =>
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
    value
  );

export default function NewMemberModal(props) {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const params = useParams();
  const { projectId } = params;
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

  function submitHandler(e) {
    e.preventDefault();
    if (!emailIsValid) {
      return;
    }
    fetch(`http://192.168.1.5:8080/project/${projectId}/member`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + auth.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailValue,
      }),
    })
      .then((res) => {
        if (res.status !== 201) {
          throw new Error();
        }
        return res.json();
      })
      .then((resData) => {
        auth.socket.emit('addMemberList', { member: resData.member });
        props.setOpen(false);
        resetEmail();
        return toast.success('member added!');
      })
      .then((res) => {
        // window.location.reload(false);
      })
      .catch((err) => toast.error('something went wrong.'));
  }
  return (
    <Modal onBackdropClick={() => props.setOpen(false)} open={props.open}>
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
  );
}
