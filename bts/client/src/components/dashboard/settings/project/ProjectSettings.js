import { useContext, useEffect, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import {
  Card,
  Divider,
  Typography,
  TextField,
  Grid,
  Button,
  // Tooltip,
} from '@material-ui/core';
// import { Restore } from '@material-ui/icons';
import { toast } from 'react-toastify';
import { useStyles } from '../../../hooks/useStyles';
import { AuthContext } from '../../../context/auth-context';
import useInput from '../../../hooks/useInput';
import DeleteProjectConfirmationModal from './DeleteProjectConfirmationModal';
import ApiKeyModal from './ApiKeyModal';
import ApiKeyCard from './ApiKeyCard';

const isEmptyTitle = (value) => value.trim().length >= 3;

export default function ProjectSettings() {
  let history = useHistory();
  const location = useLocation();
  const { projectDetail } = location.state;
  const auth = useContext(AuthContext);
  const [apiPrefix, setApiFrefix] = useState(null);
  const classes = useStyles();
  const params = useParams();
  const { projectId } = params;
  const {
    value: nameValue,
    isValid: nameIsValid,
    hasError: nameHasError,
    onChangeHandler: nameChangeHandler,
    onBlurHandler: nameBlurHandler,
    // reset: resetName,
    errorMessage: nameErrorMessage,
    // setErrorMessage: setNameErrorMessage
  } = useInput(isEmptyTitle, 'name should be longer than 3 characters', {
    value: projectDetail.title,
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
  } = useInput(isEmptyTitle, 'description is invalid', {
    value: projectDetail.description,
    isTouched: false,
  });

  useEffect(() => {
    fetch(`http://192.168.1.5:8080/project/${projectDetail._id}/key`, {
      headers: {
        Authorization: 'Bearer ' + auth.token,
      },
    })
      .then((res) => {
        if (res.status === 404 || res.status === 500 || res.status === 401) {
          history.push('/dashboard');
        }
        return res.json();
      })
      .then((resData) => {
        setApiFrefix(resData.apiKey);
      })
      .catch((err) => {});
  }, [auth.token, history, projectDetail._id]);

  function submitHandler(e) {
    e.preventDefault();
    if (!nameIsValid) {
      return;
    }
    fetch(`http://192.168.1.5:8080/project/${projectDetail._id}`, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + auth.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: nameValue,
        description: descriptionValue,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error();
        }
        return res.json();
      })
      .then((resData) => {
        toast.success('Project edited!');
        return history.push('/dashboard');
      })
      .catch((err) => {
        toast.error('Project editing failed!');
      });
  }

  return (
    <Card className={classes.cardSettingsBase}>
      <Typography variant="h6">Project Settings</Typography>
      <Divider />
      <form style={{ padding: 20 }} onSubmit={submitHandler}>
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
            {...(auth.userId === projectDetail.creator._id
              ? {}
              : { disabled: 'true' })}
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
            {...(auth.userId === projectDetail.creator._id
              ? {}
              : { disabled: 'true' })}
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
        {auth.userId === projectDetail.creator._id && (
          <Grid container justify="flex-end">
            <Button type="submit" variant="outlined" color="secondary">
              save
            </Button>
          </Grid>
        )}
      </form>
      <Divider />
      {auth.userId === projectDetail.creator._id && (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {!apiPrefix && <ApiKeyModal projectId={projectDetail._id} />}
          {apiPrefix && (
            <div>
              <Typography>
                Api link {`http://192.168.1.5:8080/api/${projectDetail._id}`}
              </Typography>
              <ApiKeyCard prefix={apiPrefix} projectId={projectDetail._id} />
            </div>
          )}
          <DeleteProjectConfirmationModal id={projectId} />
        </Grid>
      )}
    </Card>
  );
}
