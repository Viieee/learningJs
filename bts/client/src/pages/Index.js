import { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import AuthNav from '../components/layout/authNav';
import Signin from '../components/Auth/Signin';
import Signup from '../components/Auth/Signup';

function index() {
  return (
    <Fragment>
      <AuthNav />
      <Switch>
        <Route path="/signin">
          <Signin />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
      </Switch>
    </Fragment>
  );
}

export default index;
