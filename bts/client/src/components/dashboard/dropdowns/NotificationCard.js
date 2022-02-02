import { Link as RouterLink } from 'react-router-dom';
import { Card, Typography, Link } from '@material-ui/core';
import { useStyles } from '../../hooks/useStyles';

export default function NotificationCard({ data }) {
  const classes = useStyles();
  return (
    <div>
      {data.customLink && (
        <Link
          component={RouterLink}
          style={{
            textDecoration: 'none',
          }}
          to={`/dashboard/${data.customLink}`}
        >
          <Card
            className={classes.notificationCard}
            style={{
              padding: 5,
              marginTop: 5,
              display: 'block',
              width: '100%',
              height: '30%',
            }}
          >
            <Typography>{data.title}</Typography>
            <Typography
              style={{
                marginTop: 20,
                whiteSpace: 'normal',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {data.description}
            </Typography>
          </Card>
        </Link>
      )}
      {!data.customLink && (
        <Link
          component={RouterLink}
          style={{
            textDecoration: 'none',
          }}
          // to={`/dashboard/${data.customLink}`}
        >
          <Card
            className={classes.notificationCard}
            style={{
              padding: 5,
              marginTop: 5,
              display: 'block',
              width: '100%',
              height: '30%',
            }}
          >
            <Typography>{data.title}</Typography>
            <Typography
              style={{
                marginTop: 20,
                whiteSpace: 'normal',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {data.description}
            </Typography>
          </Card>
        </Link>
      )}
    </div>
  );
}
