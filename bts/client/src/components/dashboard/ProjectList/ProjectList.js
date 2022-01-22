import { Card} from '@material-ui/core';
import {useStyles} from '../../hooks/useStyles'
import ProjectListTable from './ProjectListTable';

function ProjectList() {
  const classes = useStyles();
  return (
    <Card className={classes.cardProject}>
      <ProjectListTable />
    </Card>
  );
}

export default ProjectList;
