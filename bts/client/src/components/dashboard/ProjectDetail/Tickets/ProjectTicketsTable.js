import React from 'react';
import {
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Button,
} from '@material-ui/core';
import useTable from '../../../hooks/useTable';
import {useStyles} from '../../../hooks/useStyles'
import { MoreVert, Add } from '@material-ui/icons';
import NewTicketModal from './NewTicketsModal';

let id = 0;
const createData = (title, description, status, author) => {
  id += 1;
  return { id, title, description, status, author };
};

let rows = [
  createData(
    'Ticket 1',
    'this is the description for the ticket test test test',
    'new',
    'vieri adhitya'
  ),
  createData(
    'Ticket 2',
    'this is the description for the ticket test test test',
    'ongoing',
    'vieri adhitya'
  ),
  createData(
    'Ticket 3',
    'this is the description for the ticket test test test',
    'ongoing',
    'vieri adhitya1'
  ),
  createData(
    'Ticket 4',
    'this is the description for the ticket test test test',
    'new',
    'vieri adhitya'
  ),
  createData(
    'Ticket 5',
    'this is the description for the ticket test test test',
    'new',
    'vieri adhitya'
  ),
  createData(
    'Ticket 6',
    'this is the description for the ticket test test test',
    'new',
    'vieri adhitya'
  ),
];

const headCells = [
  { id: 'title', label: 'Ticket Title', disableSorting: true },
  { id: 'description', label: 'Description', disableSorting: true },
  { id: 'status', label: 'Status' },
  { id: 'author', label: 'Ticket Author' },
];

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
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.author}</TableCell>
              <MoreVert style={{ marginTop: 15 }} />
            </TableRow>
          ))}
        </TableBody>
      </TblContainer>
      <TblPagination pageOptions={[5]} />
    </div>
  );
}
