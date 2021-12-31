import React from 'react';
import { TableBody, TableRow, TableCell, Grid } from '@material-ui/core';
import useTable from '../../hooks/useTable';
import { useStyles } from '../../hooks/useStyles';
import Timer from '../Timer/Timer';

let id = 0;
const createData = (project, title, status, timeEnd, priority) => {
  id += 1;
  return { id, project, title, status, timeEnd, priority };
};

let rows = [
  createData(
    'Project 1',
    'Ticket 1',
    'ongoing',
    new Date(2021, 12, 28, 14, 55, 2),
    'high'
  ),
  createData(
    'Project 2',
    'Ticket 2',
    'ongoing',
    new Date(2021, 12, 28, 15, 30, 0),
    'low'
  ),
  createData(
    'Project 1',
    'Ticket 3',
    'resolved',
    new Date(2021, 12, 28, 12, 30, 0),
    'low'
  ),
];

const headCells = [
  { id: 'project', label: 'Project' },
  { id: 'title', label: 'Ticket' },
  { id: 'status', label: 'Status' },
  // { id: 'estimatedTime', label: 'Estimated Time', disableSorting: true },
  { id: 'timeEnd', label: 'Estimated Time' },
  { id: 'priority', label: 'Priority' },
];

export default function TicketListTable() {
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(rows, headCells, 10);
  const classes = useStyles();

  return (
    <>
      <TblContainer className={classes.containerTicket}>
        <TblHead />
        <TableBody>
          {recordsAfterPagingAndSorting().map((item) => {
            let startDate = new Date();
            let endDate = item.timeEnd;

            let startDateTotal =
              startDate.getHours() * 3600 +
              startDate.getMinutes() * 60 +
              startDate.getSeconds();

            let endDateTotal =
              endDate.getHours() * 3600 +
              endDate.getMinutes() * 60 +
              endDate.getSeconds();

            if (endDate.getDate() < startDate.getDate()) {
              endDateTotal = 0;
            }

            const timeDeficit = endDateTotal - startDateTotal;
            return (
              <TableRow key={item.id}>
                <TableCell>{item.project}</TableCell>
                <TableCell>{item.title}</TableCell>
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
