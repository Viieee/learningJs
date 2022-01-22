import React, { useContext } from 'react';
import {
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Button,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { AuthContext } from '../../../../context/auth-context';
import { useStyles } from '../../../../hooks/useStyles';
import useTable from '../../../../hooks/useTable';
import NewMemberModal from '../AddModal/NewMemberModal';
import DeleteMemberConfirmationModal from '../Delete/DeleteMemberConfirmationModal';

const headCells = [
  { id: 'userName', label: 'Name' },
  { id: 'email', label: 'Email' },
];

export default function MembersTable(props) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const { projectDetail } = props;
  const [open, setOpen] = React.useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(projectDetail.members, headCells);


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
        {auth.userId === projectDetail.creator._id && (
          <Button
            variant="outlined"
            className={classes.buttonAddStyleDashboard}
            onClick={modalHandler}
          >
            <Add />
            New
          </Button>
        )}
        <NewMemberModal open={open} setOpen={setOpen} />
      </Grid>
      <TblContainer className={classes.containerNewMember}>
        <TblHead />
        <TableBody>
          {recordsAfterPagingAndSorting().map((item) => (
            <TableRow key={item.member._id}>
              <TableCell>{item.member.userName}</TableCell>
              <TableCell>{item.member.email}</TableCell>
              {auth.userId === projectDetail.creator._id && (
                <DeleteMemberConfirmationModal item={item.member} />
              )}
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
