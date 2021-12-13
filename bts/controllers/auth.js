const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');

exports.signup = (req, res, next) => {
  const userName = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new UserModel({
        userName: userName,
        email: email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'signup successfull, user created!',
        userId: result._id,
      });
    })
    .catch((err) => {
      if (err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
