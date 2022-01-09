import './App.css';
import { useState, useCallback } from 'react';
import Auth from './components/pages/Auth';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import ForgotPassword from './components/auth/Forgot-Password';
import Dashboard from './components/pages/Dashboard';
import { AuthContext } from './components/context/auth-context';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/account">
          <Dashboard />
        </Route>
        {/* <Route path="*">
        <p>sadge</p>
      </Route> */}
        <Redirect to="/dashboard" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/signin">
          <Auth value="signin" />
        </Route>
        <Route path="/signup">
          <Auth value="signup" />
        </Route>
        <Route path="/forget_password">
          <ForgotPassword />
        </Route>
        <Redirect to="/signin" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
      <BrowserRouter>
        <main>{routes}</main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
