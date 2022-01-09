import { useState } from 'react';
import { Menu, MenuItem, ListItemIcon, Link, Box } from '@material-ui/core';
import { Settings, ExitToApp as Logout, MoreVert } from '@material-ui/icons';

export default function ProjectDropdown() {
  const [anchorEl, setAnchorOptions] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorOptions(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorOptions(null);
  };
  return (
    <Box>
      <Link component="button" color="inherit" onClick={handleClick}>
        <MoreVert
          style={{ marginTop: 15 }}
          aria-controls={open ? 'project-menu' : undefined}
          aria-haspopup={true}
          aria-expanded={open ? 'true' : undefined}
        />
      </Link>
      <Menu
        anchorEl={anchorEl}
        id="project-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          style: {
            width: 'max-content',
            height: 'max-content',
          },
        }}
        getContentAnchorEl={null}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Link>
          <MenuItem color="red">
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Leave
          </MenuItem>
        </Link>
      </Menu>
    </Box>
  );
}
