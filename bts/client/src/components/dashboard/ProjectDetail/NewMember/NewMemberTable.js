import React from 'react';
import {
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Button,
} from '@material-ui/core';
import useTable from '../../../hooks/useTable';
import { useStyles } from '../../../hooks/useStyles';
import { Add} from '@material-ui/icons';
import NewMemberModal from './NewMemberModal';
import DeleteMemberConfirmationModal from './DeleteMemberConfirmationModal';

// let _id = 0;
const createData = (_id, name, email, role) => {
  // _id += 1;
  return { _id, name, email, role };
};

let rows = [
  createData(
    1,
    'Vieri Adhitya Harviando1',
    'adhityaharviando@gmail.com',
    'admin'
  ),
  createData(
    2,
    'Vieri Adhitya Harviando2',
    'adhityaharviando@gmail.com',
    'developer'
  ),
  createData(
    3,
    'Vieri Adhitya Harviando3',
    'adhityaharviando@gmail.com',
    'developer'
  ),
  createData(
    4,
    'Vieri Adhitya Harviando4',
    'adhityaharviando@gmail.com',
    'developer'
  ),
  createData(
    5,
    'Vieri Adhitya Harviando5',
    'adhityaharviando@gmail.com',
    'developer'
  ),
  createData(
    6,
    'Vieri Adhitya Harviando6',
    'adhityaharviando@gmail.com',
    'developer'
  ),
  createData(
    7,
    'Vieri Adhitya Harviando7',
    'adhityaharviando@gmail.com',
    'developer'
  ),
  createData(
    8,
    'Vieri Adhitya Harviando8',
    'adhityaharviando@gmail.com',
    'developer'
  ),
  createData(
    9,
    'Vieri Adhitya Harviando9',
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
              <DeleteMemberConfirmationModal item={item} />
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
