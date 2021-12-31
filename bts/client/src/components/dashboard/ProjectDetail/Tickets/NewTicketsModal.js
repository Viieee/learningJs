import {
  Button,
  Container,
  Modal,
  Snackbar,
  TextField,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@material-ui/core';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import useInput from '../../../hooks/useInput';
import {useStyles} from '../../../hooks/useStyles'

function MuiAlert(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

const isEmptyTitle = (value) => value.trim().length >= 3;

export default function NewTicketModal(props) {
  const classes = useStyles();

  const [openAlert, setOpenAlert] = useState(false);
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('New');
  const [type, setType] = useState('Bug');
  const [personName, setPersonName] = useState([]);

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

  function handleChangePriority(event) {
    setPriority(event.target.value);
  }
  function handleChangeStatus(event) {
    setStatus(event.target.value);
  }
  function handleChangeType(event) {
    setType(event.target.value);
  }
  const handleChangeMultiple = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setPersonName(value);
  };

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
    console.log(titleValue, descValue, priority, status, type, personName);
    setOpenAlert(true);
    props.setOpen(false);
    resetTitle();
    resetDesc();
  }
  return (
    <>
      <Modal open={props.open}>
        <Container className={classes.containerNewTicketModal}>
          <form
            className={classes.formNewTicketModal}
            autoComplete="off"
            onSubmit={submitHandler}
          >
            <div className={classes.itemNewTicketModal}>
              <TextField
                required
                name="title"
                value={titleValue}
                onChange={titleChangeHandler}
                onBlur={titleBlurHandler}
                error={titleHasError}
                helperText={titleHasError && titleErrorMessage}
                id="standard-basic"
                label="Ticket Title"
                size="small"
                style={{ width: '100%' }}
              />
            </div>
            <div className={classes.itemNewTicketModal}>
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
            <div className={classes.itemNewTicketModal}>
              <Grid container justify="flex-end">
                <TextField
                  select
                  required
                  value={priority}
                  label="priority"
                  onChange={handleChangePriority}
                  style={{ marginRight: 20 }}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </TextField>

                <TextField
                  select
                  required
                  label="Status"
                  value={status}
                  style={{ marginRight: 20 }}
                  onChange={handleChangeStatus}
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                  <MenuItem value="Info Required">Info Required</MenuItem>
                </TextField>
              </Grid>
            </div>
            <div className={classes.itemNewTicketModal}>
              <Grid container justify="flex-end">
                <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300 }}>
                  <InputLabel shrink htmlFor="select-multiple-native">
                    Assigned Member
                  </InputLabel>
                  <Select
                    multiple
                    native
                    value={personName}
                    // @ts-ignore Typings are not considering `native`
                    onChange={handleChangeMultiple}
                    label="Native"
                    style={{ marginRight: 30 }}
                    inputProps={{
                      id: 'select-multiple-native',
                    }}
                  >
                    {names.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  select
                  required
                  label="Type"
                  value={type}
                  onChange={handleChangeType}
                >
                  <MenuItem value="Bug">Bug</MenuItem>
                  <MenuItem value="Task">Task</MenuItem>
                  <MenuItem value="Feature Request">Feature Request</MenuItem>
                </TextField>
              </Grid>
            </div>

            <div className={classes.itemNewTicketModal}>
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
          Ticket Created!
        </MuiAlert>
      </Snackbar>
    </>
  );
}
