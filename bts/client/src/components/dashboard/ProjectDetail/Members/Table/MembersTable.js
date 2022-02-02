import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Grid,
  Button,
  MenuItem,
  IconButton,
} from '@material-ui/core';
import { Add, Done, Cancel } from '@material-ui/icons';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../../context/auth-context';
import { useStyles } from '../../../../hooks/useStyles';
import useTable from '../../../../hooks/useTable';
import NewMemberModal from '../AddModal/NewMemberModal';
// import DeleteMemberConfirmationModal from '../Delete/DeleteMemberConfirmationModal';
import MemberListDropDown from '../../../dropdowns/MemberListDropdown';

const headCells = [
  { id: 'userName', label: 'Name' },
  { id: 'role', label: 'Role' },
];

// let initialRole = 'dev';

function CustomRow({ item, role, creator }) {
  const [editMode, setEditMode] = React.useState(false);
  const [editRole, setEditRole] = React.useState(item.role);
  const params = useParams();
  const { projectId } = params;
  const auth = React.useContext(AuthContext);
  // console.log(creator);
  // const [editMode, setEditMode] = React.useState(false);
  function handleChangeRole(event) {
    setEditRole(event.target.value);
  }
  function editHandler() {
    fetch(
      `http://192.168.1.5:8080/project/${projectId}/member/${item.member._id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + auth.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: editRole,
        }),
      }
    )
      .then((res) => {
        if (res.status !== 201) {
          throw new Error();
        }
        return res.json();
      })
      .then((resData) => {
        setEditMode(false);
        return toast.success("member's role edited!");
      })
      .catch((err) => {
        toast.error('something went wrong.');
      });
  }

  return (
    <TableRow key={item.member._id}>
      <TableCell>{item.member.userName}</TableCell>
      {!editMode && <TableCell>{item.role}</TableCell>}
      {editMode && (
        <TableCell>
          <TextField
            select
            required
            value={editRole}
            label="Role"
            onChange={handleChangeRole}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="dev">Developer</MenuItem>
          </TextField>
        </TableCell>
      )}
      {((auth.userId === creator._id &&
        !editMode &&
        item.member._id !== creator._id) ||
        (role === 'admin' && !editMode && item.role !== 'admin')) && (
        <MemberListDropDown item={item.member} setEditMode={setEditMode} />
        // <DeleteMemberConfirmationModal item={item.member} />
      )}
      {role === 'admin' && editMode && (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <IconButton
            aria-label="done"
            onClick={editHandler}
            style={{ padding: 5 }}
          >
            <Done />
          </IconButton>
          <IconButton
            aria-label="revert"
            onClick={() => {
              setEditMode(false);
            }}
            style={{ padding: 5 }}
          >
            <Cancel />
          </IconButton>
        </Grid>
      )}
    </TableRow>
  );
}

export default function MembersTable(props) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const { projectDetail, projectMembers, setProjectMembers } = props;
  const [open, setOpen] = React.useState(false);
  const [newMember, setNewMember] = React.useState(null);
  const [deleteMember, setDeleteMember] = React.useState(null);

  // socket io
  useEffect(() => {
    auth.socket.on('member', (data) => {
      setNewMember(data.member);
    });
  }, [auth.socket]);

  useEffect(() => {
    auth.socket.on('deletedMember', (data) => {
      setDeleteMember(data.member);
      console.log(deleteMember);
    });
  }, [auth.socket, deleteMember]);

  useEffect(() => {
    newMember && setProjectMembers((prev) => [...prev, newMember]);
  }, [newMember, projectDetail, setProjectMembers]);

  useEffect(() => {
    deleteMember &&
      setProjectMembers((members) =>
        members.filter(
          (member) => member.member._id.toString() !== deleteMember.toString()
        )
      );
  }, [deleteMember, setProjectMembers]);

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(projectMembers, headCells);

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
        <NewMemberModal open={open} setOpen={setOpen} />
      </Grid>
      <TblContainer className={classes.containerNewMember}>
        <TblHead />
        <TableBody>
          {recordsAfterPagingAndSorting().map((item) => {
            return (
              <CustomRow
                item={item}
                role={props.role}
                creator={projectDetail.creator}
              />
            );
          })}
        </TableBody>
      </TblContainer>
      <Grid container justify="flex-end">
        <TblPagination pageOptions={[5]} />
      </Grid>
    </div>
  );
}
