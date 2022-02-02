import { useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  Link,
  Box,
  IconButton,
  Avatar,
} from '@material-ui/core';
import { Settings, ExitToApp as Logout } from '@material-ui/icons';
import { AuthContext } from '../../context/auth-context';

export default function AccountDropdown({ userData }) {
  const auth = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box>
      <IconButton
        onClick={handleClick}
        size="small"
        style={{ marginLeft: 2 }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar style={{ width: 32, height: 32 }}>
          {userData.userInitial}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
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
        <Link color="inherit" component={RouterLink} to="/account/settings">
          <MenuItem>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
        </Link>
        <Link
          color="inherit"
          onClick={() => {
            auth.logout();
          }}
        >
          <MenuItem>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Link>
      </Menu>
    </Box>
  );
}
