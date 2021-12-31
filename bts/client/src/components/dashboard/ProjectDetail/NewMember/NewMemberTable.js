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
import { Add, DeleteOutline } from '@material-ui/icons';
import NewMemberModal from './NewMemberModal';

let id = 0;
const createData = (name, email, role) => {
  id += 1;
  return { id, name, email, role };
};

let rows = [
  createData('Vieri Adhitya Harviando', 'adhityaharviando@gmail.com', 'admin'),
  createData(
    'Vieri Adhitya Harviando',
    'adhityaharviando@gmail.com',
    'developer'
  ),
  createData(
    'Vieri Adhitya Harviando',
    'adhityaharviando@gmail.com',
    'developer'
  ),
  createData(
    'Vieri Adhitya Harviando',
    'adhityaharviando@gmail.com',
    'developer'
  ),
  createData(
    'Vieri Adhitya Harviando',
    'adhityaharviando@gmail.com',
    'developer'
  ),
  createData(
    'Vieri Adhitya Harviando',
    'adhityaharviando@gmail.com',
    'developer'
  ),
  createData(
    'Vieri Adhitya Harviando',
    'adhityaharviando@gmail.com',
    'developer'
  ),
  createData(
    'Vieri Adhitya Harviando',
    'adhityaharviando@gmail.com',
    'developer'
  ),
  createData(
    'Vieri Adhitya Harviando',
    'adhityaharviando@gmail.com',
    'developer'
  ),
];

const headCells = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
];

export default function NewMemberTable() {
  const [open, setOpen] = React.useState(false);
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(rows, headCells);

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
        <h2 style={{ marginLeft: 20, marginTop: 10 }}> Team Member </h2>
        <Button
          variant="outlined"
          className={classes.buttonAddStyleDashboard}
          onClick={modalHandler}
        >
          <Add />
          New
        </Button>
        <NewMemberModal open={open} setOpen={setOpen} />
      </Grid>
      <TblContainer className={classes.containerNewMember}>
        <TblHead />
        <TableBody>
          {recordsAfterPagingAndSorting().map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <DeleteOutline
                style={{ marginTop: 10, color: 'red', }}
              />
            </TableRow>
          ))}
        </TableBody>
      </TblContainer>
      <Grid container justify="flex-end">
        <TblPagination pageOptions={[5]} />
      </Grid>
    </div>
  );
}
