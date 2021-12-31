import { Card} from '@material-ui/core';
import ProjectListTable from './ProjectListTable';
import {useStyles} from '../../hooks/useStyles'

function ProjectList() {
  const classes = useStyles();
  return (
    <Card className={classes.cardProject}>
      <ProjectListTable />
    </Card>
  );
}

export default ProjectList;
