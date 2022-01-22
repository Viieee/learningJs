import { useState } from 'react';
import { Popover, Box, Link, Badge } from '@material-ui/core';
import { Notifications } from '@material-ui/icons';
import { useStyles } from '../../hooks/useStyles';
import NotificationCard from './NotificationCard';

export default function NotificationDropdown() {
  const classes = useStyles();
  const [anchorEl, setAnchorOptions] = useState(null);
  const [notisOpened, setNotisOpened] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorOptions(event.currentTarget);
    setNotisOpened(true);
  };
  const handleClose = () => {
    setAnchorOptions(null);
  };
  return (
    <Badge badgeContent={notisOpened?null:2} color="secondary" className={classes.badge}>
      <Box>
        <Link component="button" color="inherit" onClick={handleClick}>
          <Notifications />
        </Link>
        <Popover
          anchorEl={anchorEl}
          id="project-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 3,
            style: {
              overflow: 'auto',
              width: '250px',
              height: '55vh',
              padding: 5,
            },
          }}
          getContentAnchorEl={null}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <NotificationCard />
          <NotificationCard />
          <NotificationCard />
          <NotificationCard />
        </Popover>
      </Box>
    </Badge>
  );
}
