const expressValidator = require("express-validator");
// ! express validator is sets of middlewares
// ? check is the sub package of express validator

const User = require("../models/user");

// we want to export an array of middlewares by express validator
module.exports = [
  // validating email middlware
  expressValidator
    .check("email")
    .isEmail()
    .withMessage("Please enter a valid email!")
    .custom((value, { req }) => {
      // true => promise resolve / nothing returned
      // false => promise reject / error returned
      return User.findOne({ email: value }).then((userData) => {
        if (userData) {
          // if the user inserted in the email field already exist in the database
          return Promise.reject(
            "Email already registered, please pick a different one."
          ); // it will return in promise reject and it will stored as an error
          // ? using promise in validation is called "async validation"
        }
      });
    })
    // sanitizing
    .trim(),

  // validating password middleware
  expressValidator
    .check("password", "Please enter a password with at least 5 characters")
    .isLength({ min: 5 })
    // sanitizing
    .trim(),

  // validating the confirm password middleware
  expressValidator
    .check("confirmPassword")
    .custom((value, { req }) => {
      // value is the value typed into the confirm password field in the form
      if (value !== req.body.password) {
        // if the value passed onto the confirm password field is not the same as the one in password field
        throw new Error("Password have to match!");
      }
      // if the value matched
      return true;
    })
    // sanitizing
    .trim(),
];
