import React from 'react';
import { TableBody, TableRow, TableCell, Grid } from '@material-ui/core';
import useTable from '../../hooks/useTable';
import { useStyles } from '../../hooks/useStyles';
import Timer from '../Timer/Timer';
import {rows} from '../TicketData'


const headCells = [
  { id: 'project', label: 'Project' },
  { id: 'title', label: 'Ticket' },
  { id: 'status', label: 'Status' },
  // { id: 'estimatedTime', label: 'Estimated Time', disableSorting: true },
  { id: 'dateEnd', label: 'Estimated Time' },
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
            let endDate = item.dateEnd;
            let startDateTotal = Math.floor(startDate.getTime()/1000);

            let endDateTotal = Math.floor(endDate.getTime()/1000);

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
