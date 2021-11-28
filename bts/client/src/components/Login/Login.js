import Card from '../UI/Card/Card'

import classes from './Login.module.css'

function Login() {
  return (
    <Card className={classes.container}>
      <form>
        <div>
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
          />
        </div>
        </form>
    </Card>
  );
}

export default Login;
