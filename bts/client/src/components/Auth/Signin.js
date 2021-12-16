import React from 'react';
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link as RouterLink } from 'react-router-dom';

const paperStyle = {
  padding: 20,
  height: '388.5px',
  width: 300,
  margin: '0 auto',
  // left: '50%',
  // top: '50%',
  // transform: 'translate(-50%, -50%)',
  // padding: '5px 0 0 5px',
};
const avatarStyle = { backgroundColor: '#1bbd7e' };
const btnstyle = { margin: '15px 0 10px 0' };

function Signin() {
  return (
    <Grid>
      <Paper style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <h2>Sign In</h2>
        </Grid>
        <TextField
          label="Username"
          name="username"
          placeholder="Enter username"
          fullWidth
          required
        />
        <TextField
          label="Password"
          name="password"
          placeholder="Enter password"
          type="password"
          fullWidth
          required
        />
        <Button
          type="submit"
          color="primary"
          style={btnstyle}
          variant="contained"
          fullWidth
        >
          Sign in
        </Button>
        <Typography>
          <Link component={RouterLink} to="/forget_password">Forgot password ?</Link>
        </Typography>
        <Typography>
          Do you have an account ?
          <Link component={RouterLink} to="/signup">
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Grid>
  );
}

export default Signin;
