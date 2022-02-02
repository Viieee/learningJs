import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Container,
  Modal,
  TextField,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@material-ui/core';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../../context/auth-context';
import { useStyles } from '../../../../hooks/useStyles';
import useInput from '../../../../hooks/useInput';

const isEmptyTitle = (value) => value.trim().length >= 3;
let initialPriority = 'Medium';
let initialStatus = 'New';
let initialType = 'Bug';
let initialDevs = [];
// let initialLength = 1;
let initialTitleInputState = {
  value: '',
  isTouched: false,
};
let initialDescriptionInputState = {
  value: '',
  isTouched: false,
};
let initialEndDate = new Date();

export default function NewTicketModal({
  open,
  setOpen,
  edit = false,
  ticket = null,
  projectDetail,
  setAnchorOptions,
}) {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const params = useParams();
  const { projectId } = params;
  if (edit) {
    initialTitleInputState = {
      value: ticket.title,
      isTouched: false,
    };
    initialDescriptionInputState = {
      value: ticket.description,
      isTouched: false,
    };
    initialPriority = ticket.priority;
    initialStatus = ticket.status;
    initialType = ticket.type;
    initialEndDate = new Date(ticket.timeEnd);
    // if (existedMembers.indexOf(assigned.toString()) === -1) {
    //   existedMembers.push(assigned.toString());
    // }
    for (var dev of ticket.assignedDevs) {
      if (initialDevs.indexOf(dev._id) === -1) initialDevs.push(dev._id);
    }
  }

  let {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    onChangeHandler: titleChangeHandler,
    onBlurHandler: titleBlurHandler,
    reset: resetTitle,
    errorMessage: titleErrorMessage,
    // setErrorMessage: setNameErrorMessage
  } = useInput(
    isEmptyTitle,
    'title should be longer than 3 characters',
    initialTitleInputState
  );

  let {
    value: descValue,
    // isValid: descIsValid,
    // hasError: descHasError,
    onChangeHandler: descChangeHandler,
    onBlurHandler: descBlurHandler,
    reset: resetDesc,
    // errorMessage: descErrorMessage,
    // setErrorMessage: setNameErrorMessage
  } = useInput(
    isEmptyTitle,
    'name should be longer than 3 characters',
    initialDescriptionInputState
  );

  const [priority, setPriority] = useState(initialPriority);
  const [status, setStatus] = useState(initialStatus);
  const [type, setType] = useState(initialType);
  const [personName, setPersonName] = useState(initialDevs);
  const [endDate, setEndDate] = useState(initialEndDate);
  // const [ticketLength, setTicketLength] = useState(initialLength);

  const handleChangeDate = (newValue) => {
    setEndDate(newValue);
  };
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

  function submitHandler(e) {
    e.preventDefault();
    if (!titleIsValid) {
      return;
    }
    if (!edit) {
      fetch(`http://192.168.1.5:8080/project/${projectId}/ticket`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + auth.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: titleValue,
          description: descValue,
          status: status,
          priority: priority,
          type: type,
          assignedDevs: personName,
          timeEnd: new Date(endDate),
        }),
      })
        .then((res) => {
          if (res.status !== 201) {
            throw new Error();
          }
          return res.json();
        })
        .then((resData) => {
          auth.socket.emit('addTicket', { ticket: resData.ticket });
          setOpen(false);
          resetTitle();
          resetDesc();
          return toast.success('new ticket created');
          // setAnchorOptions(null);
        })
        .catch((err) => {
          toast.error('something went wrong.');
        });
    } else {
      fetch(`http://192.168.1.5:8080/ticket/${ticket._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + auth.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: titleValue,
          description: descValue,
          status: status,
          priority: priority,
          type: type,
          assignedDevs: personName,
          timeEnd: new Date(endDate),
        }),
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error();
          }
          return res.json();
        })
        .then((resData) => {
          setOpen(false);
          resetTitle();
          resetDesc();
          setAnchorOptions(null);
          return toast.success('ticket updated!');
        })
        .catch((err) => toast.error('something went wrong.'));
    }
  }
  return (
    <Modal onBackdropClick={() => setOpen(false)} open={open}>
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
              <DateTimePicker
                label="Date&Time picker"
                value={endDate}
                onChange={handleChangeDate}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    style={{ maxWidth: '190px', minWidth: '190px' }}
                  />
                )}
              />
            </Grid>
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
              <FormControl style={{ margin: 1, minWidth: 120, maxWidth: 300 }}>
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
                  {projectDetail.members.map((member) => (
                    <option key={member.member._id} value={member.member._id}>
                      {member.member.userName}
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
                onClick={() => setOpen(false)}
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
