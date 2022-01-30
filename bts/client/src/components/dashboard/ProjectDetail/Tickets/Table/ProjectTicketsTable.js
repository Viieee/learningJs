import React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import {
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Button,
  Link,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useStyles } from '../../../../hooks/useStyles';
import useTable from '../../../../hooks/useTable';
import NewTicketModal from '../AddModal/NewTicketsModal';
import TicketDropdown from '../../../dropdowns/TicketDropdown';

const headCells = [
  { id: 'title', label: 'Ticket Title', disableSorting: true },
  { id: 'description', label: 'Description', disableSorting: true },
  { id: 'status', label: 'Status' },
  { id: 'author', label: 'Ticket Author' },
];

export default function ProjectTicketsTable(props) {
  const match = useRouteMatch();
  const [open, setOpen] = React.useState(false);
  const { projectDetail } = props;
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(projectDetail.tickets, headCells, 5);

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
        {props.role === 'admin' && (
          <Button
            variant="outlined"
            className={classes.buttonAddStyleDashboard}
            onClick={modalHandler}
          >
            <Add />
            New
          </Button>
        )}
        <NewTicketModal
          open={open}
          setOpen={setOpen}
          projectDetail={projectDetail}
        />
      </Grid>
      <TblContainer className={classes.containerProjectTickets}>
        <TblHead />
        <TableBody>
          {recordsAfterPagingAndSorting().map((ticket) => (
            <TableRow key={ticket._id}>
              {/* <TitleLink ticket={ticket} /> */}
              <TableCell>
                <Link
                  color="inherit"
                  component={RouterLink}
                  to={`${match.url}/ticket/${ticket._id}`}
                >
                  {ticket.title}
                </Link>
              </TableCell>
              <TableCell>{ticket.description}</TableCell>
              <TableCell>{ticket.status}</TableCell>
              <TableCell>{ticket.creator.userName}</TableCell>
              {props.role === 'admin' && (
                <TicketDropdown ticket={ticket} projectDetail={projectDetail} />
              )}
            </TableRow>
          ))}
        </TableBody>
      </TblContainer>
      <TblPagination pageOptions={[5]} />
    </div>
  );
}
