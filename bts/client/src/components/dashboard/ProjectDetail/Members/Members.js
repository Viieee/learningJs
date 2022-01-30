import { Card } from '@material-ui/core';
import { useStyles } from '../../../hooks/useStyles';
import MembersTable from './Table/MembersTable';

export default function Members(props) {
  const classes = useStyles();
  const { projectDetail, role } = props;
  return (
    <Card className={classes.cardNewMember}>
      <MembersTable projectDetail={projectDetail} role={role} />
    </Card>
  );
}
