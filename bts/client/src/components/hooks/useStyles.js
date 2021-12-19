import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  paperStyle: {
    width: 340,
    height: 436.5,
    position: 'absolute',
    left: '50%',
    top: '40%',
    transform: 'translate(-50%, -50%)',
    [theme.breakpoints.between(0, 400)]: {
      top: '45%',
    },
  },
  logoStyle: {
    textAlign: 'center',
    marginTop: '115px',
    [theme.breakpoints.between(0, 400)]: {
      marginTop: '5vh',
    },
  },
  innerPaperStyle: {
    padding: 20,
    height: '388.5px',
    width: 300,
    margin: '0 auto',
  },
  avatarStyle: {
    backgroundColor: '#1bbd7e',
  },
  btnstyle: {
    margin: '15px 0 10px 0',
  },
  headerStyle: {
    margin: 0,
    padding: '0px 5px'
  },
  fieldStyle: {
    width: 270,
    margin: '20px 30px 0 30px',
    padding: '2px 0',
  },
  buttonStyle: {
    width: 100,
    margin: '25px 38px 0 auto',
    display: 'block',
  },
  closeButton: {
    padding: '5px 5px'
  }
}));
