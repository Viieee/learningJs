import './App.css';
import { TextField, Grid, Paper, Button } from '@material-ui/core';
import { useStyles } from './useStyles';
import useInput from './useInput';

let initialDescriptionInputState = {
  value: '',
  isTouched: false,
};
const isEmptyTitle = (value) => value.trim().length >= 3;
function App() {
  const classes = useStyles();
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

  function submitHandler(e) {
    e.preventDefault();
    fetch(`http://192.168.1.5:8080/api/61f8ffb14a0cd06d56c117f2/`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' +
          '81e9147559616cf14932a1840ad3b947cd09322bf46f23d8d1ea42c2cf797f25',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: descValue,
      }),
    })
      .then((res) => {
        if (res.status !== 201) {
          throw new Error();
        }
        return res.json();
      })
      .then((resData) => {
        resetDesc();
      })
      .catch((err) => {});
  }

  return (
    <Grid>
      <Paper className={classes.innerPaperStyle}>
        <form onSubmit={submitHandler}>
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
          <Button
            type="submit"
            color="primary"
            className={classes.btnstyle}
            // style={{ marginTop: 50 }}
            variant="contained"
            fullWidth
          >
            Submit
          </Button>
        </form>
      </Paper>
    </Grid>
  );
}

export default App;
