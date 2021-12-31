import { createTheme } from '@material-ui/core';

const theme = createTheme({
  palette: {
    primary: {
      main: '#661e38',
    },
    secondary: {
      main: '#1E664C',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 8,
        color: 'white',
        width: 30,
        fontSize: '12px',
      },
    },
  },
});

export default theme;
