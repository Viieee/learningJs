const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("6157b8b5b318f96e943da2d4")
    .then((user) => {
      req.session.isLoggedIn = true;
      // storing the user into session so it can be shared across requests
      req.session.user = user; // ! this is no longer a mongoose object, so we can't use methods in our model anymore through req.session.user. it only stores the data of the user.
      req.session.save((err) => {
        // making sure that we save the session before redirecting
        // this method will be called when the session has been saved
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
    });
  /* 
    the values we store in session will lasted on different request we make on the website
    unlike storing it in req, and it wont be saved across users
  */
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
/* 
    we can't store isAuthenticated on req because the req will be gone once we start making different request
    the reason why we can store user data in app.js is because we make our application do the finding then storing 
    the user in req on a middleware that always run before our route files do on each request
    ! in other words we are doing the find the user and store it in req each time we make request

    we also can't store isAuthenticated only using cookie because it can be tampered with easily by the user / client side

    ! cookies won't store sensitive information but an important part of authenticating the user

    ! sessions will help with storing the sensitive informations and share it across all requests of the same user,
        ! cookie will be used to store the id of the session, the id will be hashed id and the server can decrypt it
        ! and confirm the id is correct
    sessions is a powerful tool for storing dta across requests while still scoping them to a single user,
    different user have different session
*/
