import React, { useState, useEffect, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

// reducer function
function emailReducer(state, action){
  switch (action.type){
    case "USER_INPUT":
      return {value: action.val, isValid: action.val.includes('@')}
    case "INPUT_VALIDATION":
      console.log(state)
      return {value: state.value, isValid: state.value.includes('@')}
    default:
      return  {value: '', isValid: false}
  }
}

function passwordReducer(state, action){
  switch (action.type){
    case "USER_INPUT":
      return {value: action.val, isValid: action.val.trim().length > 6}
    case "INPUT_VALIDATION":
      return {value: state.value, isValid: state.value.trim().length > 6}
    default:
      return  {value: '', isValid: false}
  }
}

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);

  // ! managing (previously) two different state on one state using useReducer
  const [emailState, dispatchEmail] = useReducer(emailReducer, {value: '', isValid: null})
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {value: '', isValid: null})

  const {isValid: emailValidity} = emailState
  const {isValid: passwordValidity} = passwordState

  useEffect(()=>{
    const identifier = setTimeout(()=>{
      console.log('checking validity')
      setFormIsValid(emailValidity && passwordValidity)
    }, 500)
    return () => {
      console.log('cleaning')
      clearTimeout(identifier)
    }
  }, [emailValidity, passwordValidity])

  const emailChangeHandler = (event) => {
    dispatchEmail({type: 'USER_INPUT', val: event.target.value})
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type: 'USER_INPUT', val: event.target.value})
  };

  const validateEmailHandler = () => {
    dispatchEmail({type: 'INPUT_VALIDATION'})
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: 'INPUT_VALIDATION'})
  };

  const submitHandler = (event) => {
    event.preventDefault();

    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
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
