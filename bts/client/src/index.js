import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterDateFns';

ReactDOM.render(
  <LocalizationProvider dateAdapter={DateAdapter}>
    <App />
  </LocalizationProvider>,
  document.getElementById('root')
);
