const User = require("../models/user");
const bcrypt = require("bcryptjs");


exports.getLogin = (req, res, next) => {
  // fetching the message stored with flash
  let message = req.flash("error"); // ! this returns an array

  /* 
    ! the argument of flash() is the key, whatever message stored with that key will be fetched
     it will only hold a value only if the user with the email inserted by the user in the login page
     doesn't exist in the database

     ! the error message is stored in the session and will be removed once it's being used
  */

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  // extracting the data from the login form
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // if the user with the email inserted in the form doesn't exist

        req.flash("error", "Invalid email or password."); // ! flashing a message using connect-flash (key, message)
        return res.redirect("/login");
      }

      // ! if the code reach here that means we have user with same email as the inserted one in the database

      /* 
        with compare(), we want to compare the password the user inserted in the login form and the user's password in the database
        ! bcrypt will do it for us and check if the password entered is the same as the before-hashed version of the password in the database
      */
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          // do matched will be true if the password entered and the before-hashed password in the database matched

          // ! if the password valid // doMatch = true
          if (doMatch) {
            // setting the session
            req.session.isLoggedIn = true;
            // storing the user into session so it can be shared across requests
            req.session.user = user; // ! this is no longer a mongoose object, so we can't methods in our model anymore through req.session.user. it only stores the data of the user.
            return req.session.save((err) => {
              // making sure that we save the session before redirecting
              // this method will be called when the session has been saved
              console.log(err);
              res.redirect("/");
            });
          }

          // ! if the password is invalid // doMatch = false
          req.flash("error", "Invalid email or password."); // ! flashing a message using connect-flash (key, message)
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
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

exports.getSignup = (req, res, next) => {
  // fetching the message stored with flash
  let message = req.flash("error"); // ! this returns an array

  /* 
    ! the argument of flash() is the key, whatever message stored with that key will be fetched
     it will only hold a value only if the user with the email inserted by the user in the login page
     doesn't exist in the database

     ! the error message is stored in the session and will be removed once it's being used
  */

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  // extracting the data from the signup form
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // ! we'll add input validation later, that means the email the user insert
  // ! dont have to be a valid email and the password dont have to be confirmed

  User.findOne({ email: email }) // finding if the user with the email inserted already exist
    .then((userData) => {
      if (userData) {
        // if the user with the same email inserted already exist
        req.flash("error", "Email already registered!"); // ! flashing a message using connect-flash (key, message)
        return res.redirect("/signup");
      }

      // ! if the code reach here that means the user inserted doesn't exist in our database yet

      // hashing the password
      return (
        bcrypt
          .hash(password, 12)
          /* 
            ! second argument of hash() is the amount of hashing bcrypt will do,
            ! the longer the safer but it will take more time to execute 
          */
          .then((hashedPassword) => {
            /* 
              will return a hashed version of the password the user inserted in the form
              ! bcrypt is the only one that can decrypt this hashed password 
            */
            // creating new user
            const user = new User({
              // based on the User model
              email: email,
              password: hashedPassword,
              cart: {
                items: [],
              },
            });
            // saving the user
            return user.save();
          })
          .then((result) => {
            // redirecting
            res.redirect("/login");
          })
          .catch((err) => {
            console.log(err);
          })
      );
    })
    .catch((err) => {
      console.log(err);
    });
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