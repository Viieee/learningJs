import { useState, useContext } from 'react';
import { Popover, Box, Link, Badge, Grid } from '@material-ui/core';
import { Notifications } from '@material-ui/icons';
import { AuthContext } from '../../context/auth-context';
import { useStyles } from '../../hooks/useStyles';
import NotificationCard from './NotificationCard';

export default function NotificationDropdown({ userData }) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [anchorEl, setAnchorOptions] = useState(null);
  const [notisOpened, setNotisOpened] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorOptions(event.currentTarget);
    setNotisOpened(true);
    fetch('http://192.168.1.5:8080/auth/user/notifications', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + auth.token,
      },
    })
      .then((res) => {
        if (res.status === 403) {
          auth.logout();
        }
        return res.json();
      })
      .catch((err) => {});
  };
  const handleClose = () => {
    setAnchorOptions(null);
  };

  return (
    <Badge
      badgeContent={notisOpened ? null : userData.unreadNotifications}
      color="secondary"
      className={classes.badge}
    >
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
          <Grid
            container
            direction="column-reverse"
            justifyContent="center"
            alignItems="center"
          >
            {userData.user.notifications.length > 0 &&
              userData.user.notifications.map((noti) => (
                <NotificationCard data={noti} />
              ))}
            {userData.user.notifications.length === 0 && 'no notifications yet'}
          </Grid>
        </Popover>
      </Box>
    </Badge>
  );
}
