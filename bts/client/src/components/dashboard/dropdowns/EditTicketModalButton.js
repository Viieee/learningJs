import React from 'react';
import { MenuItem, ListItemIcon } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import NewTicketModal from '../ProjectDetail/Tickets/NewTicketsModal';
export default function EditTicketModalButton(props) {
  const [open, setOpen] = React.useState(false);
  function modalHandler() {
    setOpen(true);
  }
  return (
    <>
      <MenuItem onClick={modalHandler}>
        <ListItemIcon>
          <Edit fontSize="small" />
        </ListItemIcon>
        Edit
      </MenuItem>
      <NewTicketModal open={open} setOpen={setOpen} edit={true} item={props.item} />
    </>
  );
}
