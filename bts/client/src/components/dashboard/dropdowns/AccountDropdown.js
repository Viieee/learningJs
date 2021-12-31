import { Menu, MenuItem, ListItemIcon, Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { Settings, ExitToApp as Logout } from '@material-ui/icons';

export default function AccountDropdown(props) {
  return (
    <Menu
      anchorEl={props.anchorEl}
      id="account-menu"
      open={props.open}
      onClose={props.handleClose}
      onClick={props.handleClose}
      style={{ marginTop: 45 }}
      PaperProps={{
        elevation: 3,
        style: {
          width: 'max-content',
          height: 'max-content',
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        Settings
      </MenuItem>
      <Link color="inherit" component={RouterLink} to="/logout">
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Link>
    </Menu>
  );
}
