import React, { useState,useEffect } from 'react';

import Login from './components/Login/Login';
import Home from './components/Home/Home';
import MainHeader from './components/MainHeader/MainHeader';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* 
  ! writing the code like this will cause the page to infinitely looped
    thats why we need useEffect()
  const storedUser = localStorage.getItem('isLoggedIn')

  if(storedUser==='1'){
    setIsLoggedIn(true)
  } 
  
  */

  useEffect(()=>{
    const storedUser = localStorage.getItem('isLoggedIn');
    console.log('test')
    if(storedUser === '1'){
      setIsLoggedIn(true)
    }
  }, []) 
  // ? empty array on the second argument above will make sure that 
    // the code inside it will only run once, when the app first starts.

  const loginHandler = (email, password) => {
    // We should of course check email and password
    // But it's just a dummy/ demo anyways
    localStorage.setItem('isLoggedIn', '1');
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem('isLoggedIn')
    setIsLoggedIn(false);
  };

  return (
    <React.Fragment>
      <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
      <main>
        {!isLoggedIn && <Login onLogin={loginHandler} />}
        {isLoggedIn && <Home onLogout={logoutHandler} />}
      </main>
    </React.Fragment>
  );
}

export default App;
