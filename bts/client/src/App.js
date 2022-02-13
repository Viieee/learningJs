import './App.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { useRef, Suspense, lazy } from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import { io } from 'socket.io-client';
// import { ToastContainer } from 'react-toastify';
import { AuthContext } from './components/context/auth-context';
import { useAuth } from './components/hooks/auth-hook';
import Dashboard from './components/pages/Dashboard';

const Auth = lazy(() => import('./components/pages/Auth'));
const ForgotPassword = lazy(() => import('./components/auth/Forgot-Password'));
const NewPassword = lazy(() => import('./components/auth/New-Password'));
const VerifyAccount = lazy(() => import('./components/auth/Verify-Account'));
const ToastContainer = lazy(async () => {
  const { ToastContainer } = await import('react-toastify');
  return { default: ToastContainer };
});
// const Dashboard = lazy(() => import('./components/pages/Dashboard'));

function App() {
  const { token, login, logout, userId } = useAuth();
  let socket = useRef();
  let routes;
  if (!token) {
    routes = (
      <Suspense fallback={<div />}>
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
      </Suspense>
    );
  } else {
    socket.current = io(
      process.env.NODE_ENV === 'development'
        ? 'http://192.168.1.9:8080'
        : 'https://protected-basin-15687.herokuapp.com',
      {
        transports: ['websocket'],
        upgrade: false,
      }
    );
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
      <Suspense fallback={<div />}>
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
      </Suspense>

      <BrowserRouter>
        <main>{routes}</main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
