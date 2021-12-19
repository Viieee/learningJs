import { useReducer, useState, useEffect } from 'react';

// initial state
const initialInputState = {
  value: '',
  isTouched: false,
};

// reducer function
function inputStateReducer(state = initialInputState, action) {
  switch (action.type) {
    case 'INPUT':
      return { value: action.value, isTouched: state.isTouched };
    case 'BLUR':
      return { value: state.value, isTouched: true };
    case 'RESET':
      return initialInputState;
    default:
      return state;
  }
}

function useInput(functionValidator, inputErrorMessage) {
  const [fieldState, dispatchFunction] = useReducer(
    inputStateReducer,
    initialInputState
  );

  const [errorMessage, setErrorMessage] = useState(null);

  const valueIsValid = functionValidator(fieldState.value);
  const hasError = !valueIsValid && fieldState.isTouched;

  useEffect(() => {
    if (hasError) {
      setErrorMessage(inputErrorMessage);
    }
  }, [hasError, inputErrorMessage, errorMessage]);

  // field onChange handler
  const onChangeHandler = (event) => {
    dispatchFunction({ type: 'INPUT', value: event.target.value });
  };

  // field onBlur handler
  const onBlurHandler = (event) => {
    dispatchFunction({ type: 'BLUR' });
  };

  // field reset
  const reset = () => {
    dispatchFunction({ type: 'RESET' });
  };

  return {
    value: fieldState.value,
    isValid: valueIsValid,
    hasError,
    onChangeHandler,
    onBlurHandler,
    reset,
    errorMessage,
    setErrorMessage,
  };
}

export default useInput;
