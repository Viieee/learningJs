import React from 'react';
import {
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Button,
  Link,
} from '@material-ui/core';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import useTable from '../../../hooks/useTable';
import { useStyles } from '../../../hooks/useStyles';
import { Add } from '@material-ui/icons';
import NewTicketModal from './NewTicketsModal';
import { rows } from '../../TicketData';
import TicketDropdown from '../../dropdowns/TicketDropdown';
const headCells = [
  { id: 'title', label: 'Ticket Title', disableSorting: true },
  { id: 'description', label: 'Description', disableSorting: true },
  { id: 'status', label: 'Status' },
  { id: 'author', label: 'Ticket Author' },
];

function TitleLink(props) {
  const match = useRouteMatch();
  return (
    <TableCell>
      <Link
        color="inherit"
        component={RouterLink}
        to={{
          pathname: `${match.url}/ticket/${props.item.id}`,
          state: {
            item: props.item,
          },
        }}
      >
        {props.item.title}
      </Link>
    </TableCell>
  );
}

export default function ProjectTicketsTable() {
  const [open, setOpen] = React.useState(false);
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(rows, headCells, 5);

  const classes = useStyles();
  function modalHandler() {
    setOpen(true);
  }

  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <h2 style={{ marginLeft: 20, marginTop: 10 }}> Tickets </h2>
        <Button
          variant="outlined"
          className={classes.buttonAddStyleDashboard}
          onClick={modalHandler}
        >
          <Add />
          New
        </Button>
        <NewTicketModal open={open} setOpen={setOpen} />
      </Grid>
      <TblContainer className={classes.containerProjectTickets}>
        <TblHead />
        <TableBody>
          {recordsAfterPagingAndSorting().map((item) => (
            <TableRow key={item.id}>
              <TitleLink item={item} />
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.author}</TableCell>
              <TicketDropdown item={item} />
            </TableRow>
          ))}
        </TableBody>
      </TblContainer>
      <TblPagination pageOptions={[5]} />
    </div>
  );
}
