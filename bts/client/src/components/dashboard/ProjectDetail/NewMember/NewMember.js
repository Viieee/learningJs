import { Card} from '@material-ui/core';
import NewMemberTable from './NewMemberTable';
import {useStyles} from '../../../hooks/useStyles'

function NewMember() {
  const classes = useStyles();
  return <Card className={classes.cardNewMember}><NewMemberTable/></Card>;
}

export default NewMember;
