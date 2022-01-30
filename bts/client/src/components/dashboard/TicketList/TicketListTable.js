import React, { useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TableBody, TableRow, TableCell, Grid, Link } from '@material-ui/core';
import useTable from '../../hooks/useTable';
import { useStyles } from '../../hooks/useStyles';
import { AuthContext } from '../../context/auth-context';
import Timer from '../Timer/Timer';

const headCells = [
  { id: 'project', label: 'Project' },
  { id: 'title', label: 'Ticket' },
  { id: 'status', label: 'Status' },
  { id: 'timeEnd', label: 'Estimated Time' },
  { id: 'priority', label: 'Priority' },
];

export default function TicketListTable() {
  const [rows, setRows] = React.useState([]);
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(rows, headCells, 10);
  const classes = useStyles();
  const auth = useContext(AuthContext);
  useEffect(() => {
    fetch('http://192.168.1.5:8080/ticket/', {
      headers: {
        Authorization: 'Bearer ' + auth.token,
      },
    })
      .then((res) => {
        if (res.status === 403) {
          auth.logout();
        }
        return res.json();
      })
      .then((resData) => {
        setRows(resData.tickets);
      })
      .catch((err) => {});
  }, [auth]);

  return (
    <>
      <TblContainer className={classes.containerTicket}>
        <TblHead />
        <TableBody>
          {recordsAfterPagingAndSorting().map((item) => {
            let startDate = new Date();
            let endDate = new Date(item.timeEnd);
            let startDateTotal = Math.floor(startDate.getTime() / 1000);

            let endDateTotal = Math.floor(endDate.getTime() / 1000);

            if (endDateTotal < startDateTotal) {
              endDateTotal = 0;
            }

            const timeDeficit = endDateTotal - startDateTotal;
            return (
              <TableRow key={item._id}>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`/dashboard/project/${item.project._id}`}
                  >
                    {item.project.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`/dashboard/project/${item.project._id}/ticket/${item._id}`}
                  >
                    {item.title}
                  </Link>
                </TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <Timer timeDeficit={timeDeficit} />
                </TableCell>
                <TableCell>{item.priority}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </TblContainer>
      <Grid container justify="flex-end">
        <TblPagination />
      </Grid>
    </>
  );
}
