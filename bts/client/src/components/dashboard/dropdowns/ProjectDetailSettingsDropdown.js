import { useState } from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  Link,
  Box,
  Button,
} from '@material-ui/core';
import { Settings, MoreHoriz } from '@material-ui/icons';
import { useStyles } from '../../hooks/useStyles';
import LeaveProjectConfirmationModal from './LeaveProjectConfirmationModal';
export default function ProjectDetailSettingsDropdown(props) {
  const match = useRouteMatch();
  const classes = useStyles();
  const [anchorEl, setAnchorOptions] = useState(null);
  const { projectDetail } = props;
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorOptions(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorOptions(null);
  };
  return (
    <Box>
      <Button
        variant="outlined"
        className={classes.buttonSettingsStyleDashboard}
        onClick={handleClick}
      >
        <MoreHoriz />
      </Button>
      <Menu
        anchorEl={anchorEl}
        id="project-menu"
        open={open}
        onClose={handleClose}
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
        <Link
          color="inherit"
          component={RouterLink}
          to={{
            pathname: `${match.url}/settings`,
            state: {
              projectDetail: projectDetail,
            },
          }}
        >
          <MenuItem>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
        </Link>
        <LeaveProjectConfirmationModal projectDetail={projectDetail} />
      </Menu>
    </Box>
  );
}
