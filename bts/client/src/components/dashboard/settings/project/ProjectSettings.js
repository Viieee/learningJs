import {
  Card,
  Divider,
  Typography,
  TextField,
  Grid,
  Button,
  Tooltip,
} from '@material-ui/core';
import { useParams, useLocation } from 'react-router-dom';
import { Restore } from '@material-ui/icons';
import { useStyles } from '../../../hooks/useStyles';
import useInput from '../../../hooks/useInput';
import DeleteProjectConfirmationModal from './DeleteProjectConfirmationModal';

const isdescription = (value) =>
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
    value
  );
const isEmptyName = (value) => value.trim().length >= 3;
const isEmptyPassword = (value) => value.trim().length >= 7;

export default function ProjectSettings() {
  const classes = useStyles();
  const params = useParams();
  const location = useLocation();
  const { item } = location.state;
  const { projectId } = params;
  const {
    value: nameValue,
    // isValid: nameIsValid,
    hasError: nameHasError,
    onChangeHandler: nameChangeHandler,
    onBlurHandler: nameBlurHandler,
    // reset: resetName,
    errorMessage: nameErrorMessage,
    // setErrorMessage: setNameErrorMessage
  } = useInput(isEmptyName, 'name should be longer than 3 characters', {
    value: item.title,
    isTouched: false,
  });

  const {
    value: descriptionValue,
    // isValid: descriptionIsValid,
    hasError: descriptionHasError,
    onChangeHandler: descriptionChangeHandler,
    onBlurHandler: descriptionBlurHandler,
    // reset: resetdescription,
    errorMessage: descriptionErrorMessage,
    // setErrorMessage: setdescriptionErrorMessage,
  } = useInput(isdescription, 'description is invalid', {
    value: item.description,
    isTouched: false,
  });

  const {
    value: apiKeyValue,
    // isValid: apiKeyValid,
    hasError: apiKeyHasError,
    onChangeHandler: apiKeyChangeHandler,
    onBlurHandler: apiKeyBlurHandler,
    // reset: resetapiKey,
    errorMessage: apiKeyErrorMessage,
    // setErrorMessage: setapiKeyErrorMessage,
  } = useInput(
    isEmptyPassword,
    'password length should be more than 7 characters'
  );

  return (
    <Card className={classes.cardSettingsBase}>
      <Typography variant="h6">Project Settings</Typography>
      <Divider />
      <form style={{ padding: 20 }}>
        <Grid
          className={classes.accountSettingsForm}
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Typography>Title</Typography>
          <TextField
            name="title"
            variant="outlined"
            value={nameValue}
            onChange={nameChangeHandler}
            onBlur={nameBlurHandler}
            error={nameHasError}
            helperText={nameHasError && nameErrorMessage}
            style={{ marginRight: 10 }}
          />
        </Grid>
        <Grid
          className={classes.accountSettingsForm}
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          style={{ marginTop: 20 }}
        >
          <Typography>Description</Typography>
          <TextField
            name="description"
            variant="outlined"
            value={descriptionValue}
            onChange={descriptionChangeHandler}
            onBlur={descriptionBlurHandler}
            error={descriptionHasError}
            helperText={descriptionHasError && descriptionErrorMessage}
            style={{ marginRight: 30 }}
          />
        </Grid>
        <Grid container justify="flex-end">
          <Button type="submit" variant="outlined" color="secondary">
            save
          </Button>
        </Grid>
      </form>
      <Divider />
      <form style={{ padding: 20 }}>
        <Grid
          className={classes.accountSettingsForm}
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Typography>API Key</Typography>
          <TextField
            disabled="true"
            name="apiKey"
            variant="outlined"
            type="text"
            onChange={apiKeyChangeHandler}
            value={apiKeyValue}
            onBlur={apiKeyBlurHandler}
            error={apiKeyHasError}
            helperText={apiKeyHasError && apiKeyErrorMessage}
            style={{ maxWidth: 350, minWidth: 350 }}
          />
          <Tooltip title="Reset Api Key">
            <Button
              type="submit"
              variant="outlined"
              color="secondary"
              style={{ maxWidth: 40, minWidth: 40 }}
            >
              <Restore />
            </Button>
          </Tooltip>
        </Grid>
      </form>
      <Grid container justify="center">
        <DeleteProjectConfirmationModal id={projectId} />
      </Grid>
    </Card>
  );
}
