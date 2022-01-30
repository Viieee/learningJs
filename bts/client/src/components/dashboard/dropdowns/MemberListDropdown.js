import { useState } from 'react';
import { Menu, Link, Box, MenuItem, ListItemIcon } from '@material-ui/core';
import { MoreVert, Edit } from '@material-ui/icons';
import DeleteMemberConfirmationModal from '../ProjectDetail/Members/Delete/DeleteMemberConfirmationModal';

export default function MemberListDropDown(props) {
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
        <MenuItem
          onClick={() => {
            props.setEditMode(true);
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Edit Role
        </MenuItem>
        <DeleteMemberConfirmationModal item={props.item} />
      </Menu>
    </Box>
  );
}
