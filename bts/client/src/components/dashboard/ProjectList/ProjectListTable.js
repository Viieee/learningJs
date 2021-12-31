import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Grid,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Link,
} from '@material-ui/core';
import useTable from '../../hooks/useTable';
import { useStyles } from '../../hooks/useStyles';
import { Add, MoreVert } from '@material-ui/icons';
import NewProjectModal from './NewProjectModal';
// import Stack from '@mui/material/Stack';

let id = 0;
const createData = (title, description, creator) => {
  id += 1;
  return { id, title, description, creator };
};

let rows = [
  createData(
    'Project 1',
    'description 1 test test test test test test yurrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr yurrrrrrrrrrrrrrrrrrrrrrrrrrrrr yurrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
    'Vieri Adhitya21'
  ),
  createData(
    'Project 2',
    'description 2 test test test test test test yurrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr yurrrrrrrrrrrrrrrrrrrrrrrrrrrrr yurrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
    'Vieri Adhitya12'
  ),
  createData(
    'Project 3',
    'description 3 test test test test test test yurrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr yurrrrrrrrrrrrrrrrrrrrrrrrrrrrr yurrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
    'Vieri Adhitya33'
  ),
  createData(
    'Project 4',
    'description 4 test test test test test test yurrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr yurrrrrrrrrrrrrrrrrrrrrrrrrrrrr yurrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
    'Vieri Adhitya14'
  ),
  createData(
    'Project 5',
    'description 5 test test test test test test yurrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr yurrrrrrrrrrrrrrrrrrrrrrrrrrrrr yurrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
    'Vieri Adhitya52'
  ),
];

const headCells = [
  { id: 'title', label: 'Title' },
  { id: 'description', label: 'Description', disableSorting: true },
  { id: 'creator', label: 'Creator' },
];

export default function ProjectListTable() {
  const [open, setOpen] = React.useState(false);
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(rows, headCells, 10);

  const classes = useStyles();

  function modalHandler() {
    setOpen(true);
  }

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <h2 style={{ marginLeft: 20, marginTop: 10 }}> Projects </h2>
        <Button
          variant="outlined"
          className={classes.buttonAddStyleDashboard}
          onClick={modalHandler}
        >
          <Add />
          New
        </Button>
        <NewProjectModal open={open} setOpen={setOpen} />
      </Grid>
      <TblContainer className={classes.containerProject}>
        <TblHead />
        <TableBody>
          {recordsAfterPagingAndSorting().map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Link
                  component={RouterLink}
                  to={`/dashboard/project/${item.id}`}
                >
                  {item.title}
                </Link>
              </TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.creator}</TableCell>
              <MoreVert style={{ marginTop: 15 }} />
            </TableRow>
          ))}
        </TableBody>
      </TblContainer>
      <Grid container justify="flex-end">
        <TblPagination />
      </Grid>
    </>
  );
}
