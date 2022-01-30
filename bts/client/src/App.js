import './App.css';
import { useRef } from 'react';
import {
  Switch,
  Route,
  Redirect,
  BrowserRouter,
  // useHistory,
} from 'react-router-dom';
import { io } from 'socket.io-client';
import { ToastContainer } from 'react-toastify';
import { AuthContext } from './components/context/auth-context';
import { useAuth } from './components/hooks/auth-hook';
import Auth from './components/pages/Auth';
import ForgotPassword from './components/auth/Forgot-Password';
import NewPassword from './components/auth/New-Password';
import VerifyAccount from './components/auth/Verify-Account';
import Dashboard from './components/pages/Dashboard';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { token, login, logout, userId } = useAuth();
  let socket = useRef();
  // let history = useHistory();
  let routes;
  if (!token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Redirect to="/signin" />
        </Route>
        <Route path="/signin">
          <Auth value="signin" />
        </Route>
        <Route path="/signup">
          <Auth value="signup" />
        </Route>
        <Route path="/forget_password">
          <ForgotPassword />
        </Route>
        <Route path="/new-password/:token">
          <NewPassword />
        </Route>
        <Route path="/verify-account/:token">
          <VerifyAccount />
        </Route>
        {!localStorage.getItem('userData') && (
          <Route path="*">
            <Redirect to="/signin" />
          </Route>
        )}
      </Switch>
    );
  } else {
    socket.current = io('http://192.168.1.5:8080', {
      transports: ['websocket'],
      upgrade: false,
    });
    routes = (
      <Switch>
        <Route path="/" exact>
          <Dashboard />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/account">
          <Dashboard />
        </Route>
        {localStorage.getItem('userData') && (
          <Route path="*">
            <Redirect to="/dashboard" />
          </Route>
        )}
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
        socket: socket.current,
        // history: history,
      }}
    >
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <BrowserRouter>
        <main>{routes}</main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
