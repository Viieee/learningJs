import { Link as RouterLink } from 'react-router-dom';
import {
  Link,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  List as ListIcon,
  Home,
  BugReport,
} from '@material-ui/icons';
function SideDrawerContent(props) {
  return (
    <div>
      <Toolbar>
        <BugReport /> Bug Tracking System
      </Toolbar>
      <Divider />
      <List>
        <Link color="inherit" component={RouterLink} to="/dashboard">
          <ListItem onClick={props.handleDrawerToggle}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </Link>
        <Link color="inherit" component={RouterLink} to="/dashboard/tickets">
          <ListItem onClick={props.handleDrawerToggle}>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="Tickets" />
          </ListItem>
        </Link>
      </List>
    </div>
  );
}

export default SideDrawerContent;
