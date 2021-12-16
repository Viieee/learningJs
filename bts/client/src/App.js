import './App.css';
import Auth from './components/pages/Auth';
import { Switch, Route, Redirect } from 'react-router-dom';
import ForgotPassword from './components/auth/Forgot-Password';

function App() {
  return (
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
      <Route path="*">
        <p>sadge</p>
      </Route>
    </Switch>
  );
}

export default App;
