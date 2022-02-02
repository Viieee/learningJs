import React, { useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Grid,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Link,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useStyles } from '../../hooks/useStyles';
import { AuthContext } from '../../context/auth-context';
import useTable from '../../hooks/useTable';
import NewProjectModal from './NewProjectModal';

const headCells = [
  { id: 'title', label: 'Title' },
  { id: 'description', label: 'Description', disableSorting: true },
  { id: 'creator', label: 'Creator' },
];

export default function ProjectListTable() {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [newProject, setNewProject] = React.useState(null);

  // socket io
  useEffect(() => {
    auth.socket.on('loadProject', (data) => {
      setNewProject(data.project);
    });
  }, [auth.socket]);

  useEffect(() => {
    newProject && setRows((prev) => [newProject, ...prev]);
  }, [newProject]);

  useEffect(() => {
    fetch('http://192.168.1.5:8080/project/', {
      headers: {
        Authorization: 'Bearer ' + auth.token,
      },
    })
      .then((res) => {
        if (res.status === 404) {
          auth.logout();
        }
        return res.json();
      })
      .then((resData) => {
        setRows(resData.projects);
      })
      .catch((err) => {});
  }, [auth]);

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
        <TableBody >
          {recordsAfterPagingAndSorting().map((item, index) => (
            <TableRow key={item._id}>
              <TableCell align="center">
                <Link
                  component={RouterLink}
                  to={`/dashboard/project/${item._id}`}
                >
                  {item.title}
                </Link>
              </TableCell >
              <TableCell align="center">{item.description}</TableCell>
              <TableCell align="center">{item.creator.userName}</TableCell>
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
