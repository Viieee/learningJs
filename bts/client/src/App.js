import { Fragment, useCallback, useEffect, useState } from 'react';

import './App.css';
import Login from './components/Login/Login';

function App() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const fetchingTickets = useCallback(() => {
    fetch('http://localhost:8080/project/ticket')
      .then((res) => console.log(res.json()))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetchingTickets();
  }, [fetchingTickets]);

  function submitHandler(event) {
    event.preventDefault();
  }

  function titleChangeHandler(event){

  }

  return (
    // <Login/>
    <Fragment>
      <form onSubmit={submitHandler}>
        <input onChange={titleChangeHandler}></input>
        <input></input>
      </form>
    </Fragment>
  );
}

export default App;
