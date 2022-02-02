import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Link } from '@material-ui/core';
import { AuthContext } from '../../../../context/auth-context';
import useInput from '../../../../hooks/useInput';

const isEmptyTitle = (value) => value.trim().length >= 0;

export default function CommentForm() {
  const params = useParams();
  const { ticketId } = params;
  const auth = useContext(AuthContext);
  let {
    value: commentValue,
    isValid: commentIsValid,
    hasError: commentHasError,
    onChangeHandler: commentChangeHandler,
    onBlurHandler: commentBlurHandler,
    reset: resetComment,
    errorMessage: commentErrorMessage,
    // setErrorMessage: setNameErrorMessage
  } = useInput(isEmptyTitle, 'comment cannot be empty');

  function sendComment(e) {
    e.preventDefault();
    if (!commentIsValid) {
      return;
    }
    fetch(`http://192.168.1.5:8080/ticket/${ticketId}/comment`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + auth.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: commentValue,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          return;
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData.comment);
        auth.socket.emit('addComment', { comment: resData.comment });
        resetComment();
      })
      .catch((err) => console.log(err));
  }
  return (
    <form style={{ display: 'flex', marginTop: '20px' }} onSubmit={sendComment}>
      <TextField
        label="add comment"
        value={commentValue}
        onChange={commentChangeHandler}
        onBlur={commentBlurHandler}
        error={commentHasError}
        helperText={commentHasError && commentErrorMessage}
        multiline
        rows={2}
        size="small"
        variant="outlined"
        className="post__input"
        style={{ width: '100%' }}
        InputProps={{
          endAdornment: (
            <Link component="button" type="submit" variant="contained">
              SEND
            </Link>
          ),
        }}
      />
    </form>
  );
}
