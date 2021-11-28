import React, { useState, useEffect, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

function reducer(state, action) {
  switch (action.type) {
    case 'INPUT_EMAIL':
      console.log(action);
      return {
        email: action.val,
        emailValid: action.val.includes('@'),
        password: state.password,
        passValid: state.password.trim().length > 6,
      };
    case 'INPUT_PASSWORD':
      return {
        password: action.val,
        passValid: action.val.trim().length > 6,
        email: state.email,
        emailValid: state.email.includes('@'),
      };
    case 'EMAIL_VALIDITY':
      console.log(state);
      return {
        email: state.email,
        emailValid: state.email.includes('@'),
        password: state.password,
        passValid: state.password.trim().length > 6,
      };
    case 'PASS_VALIDITY':
      return {
        password: state.password,
        passValid: state.password.trim().length > 6,
        email: state.email,
        emailValid: state.email.includes('@'),
      };
    default:
      return { email: '', emailValid: false, password: '', passValid: false };
  }
}

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [formState, formDispatch] = useReducer(reducer, {
    email: '',
    emailValid: null,
    password: '',
    passValid: null,
  });

  const {emailValid: emailValidity} = formState
  const {passValid: passwordValidity} = formState

  useEffect(()=>{
    const identifier = setTimeout(()=>{
      console.log('checking validity')
      setFormIsValid(emailValidity && passwordValidity)
    }, 500)
    return ()=>{
      console.log('cleaning up')
      clearTimeout(identifier)
    }
  }, [emailValidity, passwordValidity])

  const emailChangeHandler = (event) => {
    formDispatch({ type: 'INPUT_EMAIL', val: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    formDispatch({type: 'INPUT_PASSWORD', val: event.target.value})
  };

  const validateEmailHandler = () => {
    formDispatch({ type: 'EMAIL_VALIDITY' });
  };

  const validatePasswordHandler = () => {
    formDispatch({type: 'PASS_VALIDITY'})
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(formState.email, formState.password);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            formState.emailValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={formState.email}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            formState.passValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formState.password}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
