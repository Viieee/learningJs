import { Link } from 'react-router-dom';
function authNav() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/signin">Sign in</Link>
          </li>
          <li>
            <Link to="/signup">Sign up</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default authNav;
