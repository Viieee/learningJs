const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // getting the header
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    // if the authorizatin header doesn't exist
    const error = new Error("not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  // extract token from incoming request
  const token = req.get("Authorization").split(" ")[1]; // getting header value
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "my secret");
    /* 
        ! the verify method will both decode and verify the token
        the second argument in the verify() method is the secret used to decode the token
        it has to be the same secret code used when signing it in the first place (look at auth.js controller)
    */
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    // this will trigger if jwt is unable to verify the token
    const error = new Error("Not Authenticated, begone thot!");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  // ! now the userId on request contain the user's id (this will be usefull for crud operations later)
  // ? the token will contain the data we decided to store when we first created it
  next();
};

/* 
    how to attach token from front-end to back-end
    1. using query parameter 
    2. include it in request body (not ideal because the get method doesn't have body)
    3. use header
*/
