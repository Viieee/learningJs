import { useContext, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import DeleteCommentModal from './DeleteCommentModal';
import { AuthContext } from '../../../../context/auth-context';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));
export default function Comment({ comment }) {
  const classes = useStyles();
  var matches = comment.creator.userName.match(/\b(\w)/g);
  let acronym = matches.join('').slice(0, 2);
  const auth = useContext(AuthContext);
  return (
    <List className={classes.root}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar>{acronym}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={comment.creator.userName}
          secondary={
            <Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {comment.body}
              </Typography>
            </Fragment>
          }
        />
        {comment.creator._id === auth.userId && (
          <DeleteCommentModal commentId={comment._id} />
        )}
      </ListItem>
      <Divider variant="inset" component="li" />
    </List>
  );
}
