const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const product = require("../models/product");
const expressValidator = require("express-validator");

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "viiieee@outlook.com",
    pass: "Kenway99.",
  },
});

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
    oldInput: {
      email: "",
      password: "",
    },
  });
};

exports.postLogin = (req, res, next) => {
  // extracting the data from the login form
  const email = req.body.email;
  const password = req.body.password;

  // extracting the error from validation
  const errors = expressValidator.validationResult(req); // it will store something if the validation in the routes returns error

  if (!errors.isEmpty()) {
    // if theres an error
    return res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
    });
    // ! if we reach this if statement that means the code after this line wont be executed because we already send a response
  }

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
      return bcrypt
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
      // handling error using error handler middleware
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
      // ! if we returning next and passing an error as an argument, we are letting express know that an error occured and it will move to the error handling middleware
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

  // extracting the error from validation
  const errors = expressValidator.validationResult(req); // it will store something if the validation in the routes returns error

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationError: errors.array(),
  });
};

exports.postSignup = (req, res, next) => {
  // extracting the data from the signup form
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // extracting the error from validation
  const errors = expressValidator.validationResult(req); // it will store something if the validation in the routes returns error

  /* 
    console.log(errors.array())

    ! output example:
    [
      {
        value: 'dummy',
        msg: 'Please enter a valid email!',
        param: 'email',
        location: 'body'
      },
      {
        value: 'sdf',
        msg: 'Please enter a password with at least 5 characters',
        param: 'password',
        location: 'body'
      },
      {
        value: 'asf',
        msg: 'Password have to match!',
        param: 'confirmPassword',
        location: 'body'
      }
    ]

  */
  if (!errors.isEmpty()) {
    // if theres an error

    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationError: errors.array(),
    });
    // ? 422 is validation error status
  }

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
        const nodeEmail = {
          from: "viiieee@outlook.com",
          to: email,
          subject: "Signup succeeded!",
          html: "<h1>You successfully signed up!</h1>",
        };

        return transporter.sendMail(nodeEmail, function (err, info) {
          if (err) {
            console.log(err);
            return;
          }
          console.log("sent: " + info.response);
        });
      })
      .then((result) => {
        // redirecting
        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
      })
  );
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
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

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    /* 
      the first argument is the size of the bytes generated by crypto
      second argument is the callback function that will execute after the bytes being generated
        the bytes can be fetched through the // ! buffer
    */
    if (err) {
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          // if the user doesn't exist
          req.flash("error", "No account with that email found!");
          return res.redirect("/reset");
        }

        // ! if the code manages to reach here, that means the user with the inserted email does exist

        user.resetToken = token; // setting the user token into the buffer generated by crypto
        user.resetTokenExpiration = Date.now() + 3600000; // the expiration date, in an hour // ! the default is in miliseconds.

        // saving the change on user
        return user.save();
      })
      .then((result) => {
        // sending the email
        const nodeEmail = {
          from: "viiieee@outlook.com",
          to: email,
          subject: "Password Reset",
          html: `
            <p> You requested a password reset </p>
            <p> Click this <a href="http://localhost:3000/new-password/${token}">link</a> to set a new password </p>
          `,
        };

        return transporter.sendMail(nodeEmail, function (err, info) {
          if (err) {
            console.log(err);
            return;
          }
          console.log("sent: " + info.response);
        });
      })
      .then((result) => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
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

  // fetching the token in the url
  const token = req.params.token;

  // finding user with the same token set in the database
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }) // ! more than one criteria on this one
    /* 
    ! explanation on the second criteria
    $gt: Date.now() means the expiration date of the token is greater than our current time (it wasn't expired yet)
  */
    .then((user) => {
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "Update Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      // handling error using error handler middleware
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
      // ! if we returning next and passing an error as an argument, we are letting express know that an error occured and it will move to the error handling middleware
    });
};

exports.postNewPassword = (req, res, next) => {
  // fetching the data from the form
  const userId = req.body.userId;
  const newPassword = req.body.password;
  const passwordToken = req.body.passwordToken;

  // finding the user
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    /* 
    ! more than one criteria on the findOne()
    we want a user that
    1. has the same resetToken as the token passed from the url in the get page
    2. the token fetched hasn't expired yet
    3. the id matched
  */
    .then((user) => {
      // returns an object of user

      // hashing the new password
      return bcrypt
        .hash(newPassword, 12)
        .then((hashedNewPassword) => {
          // update the password of the user
          user.password = hashedNewPassword;
          // removing the token once it's used
          user.resetToken = undefined;
          user.resetTokenExpiration = undefined;

          return user.save();
        })
        .then((result) => {
          // sending the email
          const nodeEmail = {
            from: "viiieee@outlook.com",
            to: user.email,
            subject: "password changed!",
            html: "<h1>You successfully change your password!</h1>",
          };

          return transporter.sendMail(nodeEmail, function (err, info) {
            if (err) {
              console.log(err);
              return;
            }
            console.log("sent: " + info.response);
          });
        })
        .then((result) => {
          // redirect
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
        });
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
