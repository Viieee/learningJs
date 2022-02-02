import { Typography, Tooltip, Grid } from '@material-ui/core';
import DeleteKey from './DeleteKey';
export default function ApiKeyCard(props) {
  return (
    <div>
      <Typography variant="h6">Api Key</Typography>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography>prefix: {props.prefix}</Typography>
        <Tooltip title="Delete Api Key">
          <DeleteKey projectId={props.projectId} />
        </Tooltip>
      </Grid>
    </div>
  );
}
