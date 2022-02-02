import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Container,
  Modal,
  TextField,
  Grid,
  Typography,
} from '@material-ui/core';
// import KeyIcon from '@mui/icons-material/Key';
import { VpnKey, Close } from '@material-ui/icons';
import CircularProgress from '@mui/material/CircularProgress';
import { useStyles } from '../../../hooks/useStyles';
import { AuthContext } from '../../../context/auth-context';
import { IconButton, Tooltip } from '@material-ui/core';
import { FileCopy } from '@material-ui/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function ApiKeyModal({ projectId }) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState(null);

  function apiKeyModalHandler() {
    setOpen(true);
    fetch(`http://192.168.1.5:8080/project/${projectId}/apiKey`, {
      headers: {
        Authorization: 'Bearer ' + auth.token,
      },
    })
      .then((res) => {
        if (res.status === 404 || res.status === 500) {
          history.replace('/dashboard');
        }
        return res.json();
      })
      .then((resData) => {
        setApiKey(resData.apiKey);
      })
      .catch((err) => {});
  }

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        style={{ maxWidth: 200, minWidth: 200 }}
        onClick={apiKeyModalHandler}
      >
        <VpnKey /> Get API Key
      </Button>
      <Modal
        onBackdropClick={() => {
          setOpen(false);
          window.location.reload(false);
        }}
        open={open}
      >
        <Container className={classes.containerApiKeyModal}>
          <Grid>
            {!apiKey && (
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <CircularProgress />
              </Grid>
            )}
            {apiKey && (
              <div>
                <Grid
                  container
                  direction="row-reverse"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <IconButton
                    style={{ float: 'right', padding: 0 }}
                    onClick={() => {
                      setOpen(false);
                      window.location.reload(false);
                    }}
                  >
                    <Close />
                  </IconButton>
                  <Typography style={{ marginBottom: 10 }}>
                    New Api Key created and
                    <strong> it will be displayed only now </strong>
                  </Typography>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <TextField
                    disabled="true"
                    name="apiKey"
                    variant="outlined"
                    type="text"
                    value={apiKey}
                    style={{ maxWidth: 400, minWidth: 400 }}
                    InputProps={{
                      endAdornment: (
                        <CopyToClipboard text={apiKey}>
                          <Tooltip title="Copy Key">
                            <IconButton>
                              <FileCopy />
                            </IconButton>
                          </Tooltip>
                        </CopyToClipboard>
                      ),
                    }}
                  />
                </Grid>
                <Typography style={{ marginTop: 10 }}>
                  Please store it somewhere safe because as soon as you navigate
                  away from this modal, <br />
                  we will not be able to retrieve or restore this generated
                  token
                </Typography>
              </div>
            )}
          </Grid>
        </Container>
      </Modal>
    </>
  );
}
