import React from 'react';
// import { useStyles } from '../hooks/useStyles';
import { Grid } from '@material-ui/core';

const PageNotFound = () => {
  // const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      {/* <img
        className={classes.notFoundPageImage}
        src="https://i.imgur.com/qIufhof.png"
      /> */}
      <h1>404</h1>
      <h3>This page could not be found</h3>
    </Grid>
  );
};

export default PageNotFound;
