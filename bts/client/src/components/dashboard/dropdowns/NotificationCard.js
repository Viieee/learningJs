import { Card, Typography} from '@material-ui/core';
export default function NotificationCard() {
  return (
    <Card
      style={{
        padding: 5,
        marginTop: 5,
        display: 'block',
        width: '100%',
        height: '30%',
      }}
    >
      <Typography>notification title</Typography>
      <Typography style={{ marginTop: 20, whiteSpace: 'normal', textOverflow: 'ellipsis', overflow: 'hidden'}}>
        notification description tst testtststsetstafasfgskjskfjsfjlkjoiwjfoijfioejfiowjo
      </Typography>
    </Card>
  );
}
