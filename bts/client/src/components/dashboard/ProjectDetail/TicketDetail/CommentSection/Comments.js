import { useState, useContext, useEffect } from 'react';
import { Container, Grid } from '@material-ui/core';
import { AuthContext } from '../../../../context/auth-context';
import CommentForm from './CommentForm';
import { useStyles } from '../../../../hooks/useStyles';
import Comment from './Comment';
export default function Comments({ comments, setComments }) {
  console.log(comments);
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [newComment, setNewComment] = useState(null);
  const [deletedComment, setDeletedComment] = useState(null);

  useEffect(() => {
    auth.socket.on('comment', (data) => {
      setNewComment(data.comment);
    });
  }, [auth.socket]);

  useEffect(() => {
    newComment && setComments((comments) => [...comments, newComment]);
  }, [newComment, setComments]);

  useEffect(() => {
    auth.socket.on('deletedComment', (data) => {
      setDeletedComment(data.comment);
    });
  }, [auth.socket]);

  useEffect(() => {
    deletedComment &&
      setComments((comments) =>
        comments.filter(
          (comment) => comment._id.toString() !== deletedComment.toString()
        )
      );
  }, [deletedComment, setComments]);
  
  return (
    <Container className={classes.commentSectionCard}>
      <h3 className="comments-title">Comments</h3>
      <CommentForm submitLabel="Write" />
      <div className={classes.comments}>
        <Grid
          container
          direction="column-reverse"
          justifyContent="center"
          alignItems="center"
        >
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </Grid>
      </div>
    </Container>
  );
}
