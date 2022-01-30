import { Container } from '@material-ui/core';
import CommentForm from './CommentForm';
import { useStyles } from '../../../../hooks/useStyles';
import Comment from './Comment';
export default function Comments({ comments }) {
  const classes = useStyles();
  return (
    <Container className={classes.commentSectionCard}>
      <h3 className="comments-title">Comments</h3>
      <div className={classes.comments}>
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>
      <CommentForm submitLabel="Write" />
    </Container>
  );
}
