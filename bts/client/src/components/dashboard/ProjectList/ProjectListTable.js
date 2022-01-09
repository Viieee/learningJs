import React, { useEffect } from 'react';
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
import { Add } from '@material-ui/icons';
import NewProjectModal from './NewProjectModal';

const headCells = [
  { id: 'title', label: 'Title' },
  { id: 'description', label: 'Description', disableSorting: true },
  { id: 'creator', label: 'Creator' },
];

function ItemLink(props) {
  return (
    <>
      <Link
        component={RouterLink}
        to={{
          pathname: `/dashboard/project/${props.item._id}`,
          state: {
            item: props.item,
          },
        }}
      >
        {props.item.title}
      </Link>
    </>
  );
}

export default function ProjectListTable() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/project/', {
      headers: {
        // Authorization: 'Bearer ' + this.props.token,
        // 'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        setRows(resData.projects);
      });
  }, []);

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(rows, headCells, 10);

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
          {recordsAfterPagingAndSorting().map((item, index) => (
            <TableRow key={item._id}>
              <TableCell>
                <ItemLink item={item} />
              </TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.creator}</TableCell>
              {/* <ProjectDropdown/> */}
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
