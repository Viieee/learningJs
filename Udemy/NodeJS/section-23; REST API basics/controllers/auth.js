const UserModel = require("../models/user");
const ExpressValidator = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  const errors = ExpressValidator.validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed!");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new UserModel({
        email: email,
        name: name,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "user created!", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  UserModel.findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log(user);
        // if the user doesn't exist
        const error = new Error("the user doesn't exist!");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      // validating the password
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        // if the password doesn't matched
        const error = new Error("the user doesn't exist!");
        error.statusCode = 401;
        throw error;
      }
      // if password matched, generate json web token (jwt)
      const token = jwt.sign(
        {
          // storing user data
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        "my secret",
        { expiresIn: "1h" }
      );
      /* 
        ? sign = signature
        ? second argument is the secret (private key)
        ? third argument is the extra configuration
       */
      res.status(200).json({
        message: "login successfull!",
        token: token,
        userId: loadedUser._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getStatus = (req, res, next) => {
  UserModel.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("user not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        status: user.status,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.editStatus = (req, res, next) => {
  const newStatus = req.body.status;
  UserModel.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("user not found");
        error.statusCode = 404;
        throw error;
      }
      user.status = newStatus;
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "user updated" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
