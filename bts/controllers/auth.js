require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com', // hostname
  service: 'hotmail',
  secure: true,
  auth: {
    user: 'BtsVie@outlook.com',
    pass: process.env.AUTH_PASS,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

exports.signup = async (req, res, next) => {
  const { userName, email, password } = req.body;

  let token;
  let hashedPassword;
  try {
    token = crypto.randomBytes(32).toString('hex');
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new Error('sending reset email error');
    error.statusCode = 500;
    return next(error);
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error = new Error('Email is already registered!');
      error.statusCode = 409;
      return next(error);
    }
  } catch (err) {
    const error = new Error('sign up failed!');
    error.statusCode = 500;
    return next(error);
  }
  const newUser = new User({
    userName: userName,
    email: email,
    password: hashedPassword,
    projects: [],
    tickets: [],
    notifications: [],
    verificationToken: token,
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new Error('sign up failed!');
    error.statusCode = 500;
    return next(error);
  }

  try {
    const nodeEmail = {
      from: 'btsvie@outlook.com',
      to: email,
      subject: 'Signup succeeded!',
      html: `
    <p> Click this <a href="http://192.168.1.5:3000/verify-account/${token}">link</a> to verify your account </p>
    `,
    };
    transporter.sendMail(nodeEmail, function (err, info) {
      if (err) {
        console.log(err);
        return;
      }
      console.log('sent: ' + info.response);
    });
  } catch (err) {
    const error = new Error('sign up failed!');
    error.statusCode = 500;
    return next(error);
  }

  res.status(201).json({
    message: 'signup successfull, user created!',
    userId: newUser._id,
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email });
    if (!user) {
      // if the user doesn't exist
      const error = new Error("the user doesn't exist!");
      error.statusCode = 404;
      return next(error);
    }
    if (user.verified === false) {
      const error = new Error("user's email hasn't been verified");
      error.statusCode = 403;
      return next(error);
    }
  } catch (err) {
    const error = new Error('login failed!');
    error.statusCode = 500;
    return next(error);
  }

  try {
    let comparingPass = await bcrypt.compare(password, user.password);
    if (!comparingPass) {
      // if the password doesn't matched
      const error = new Error("password doesn't match!");
      error.statusCode = 401;
      return next(error);
    }
  } catch (err) {
    const error = new Error('login failed!');
    error.statusCode = 500;
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        // storing user data
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.SECRET,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new Error('login failed!');
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json({
    message: 'login successfull!',
    token: token,
    userId: user._id.toString(),
    userName: user.userName,
  });
};

// sending the reset password request to email
exports.postReset = async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  let token;
  try {
    token = crypto.randomBytes(32).toString('hex');
    console.log(token);
  } catch (err) {
    const error = new Error('sending reset email error');
    error.statusCode = 500;
    return next(error);
  }

  let user;
  try {
    // user = await User.findOne({ email: email });
    user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('email is not registered yet');
      error.statusCode = 404;
      return next(error);
    }
    user.resetToken = token; // setting the user token into the buffer generated by crypto
    user.resetTokenExpiration = Date.now() + 3600000; // the expiration date, in an hour // ! the default is in miliseconds.
    await user.save();
  } catch (err) {
    const error = new Error('sending reset email error');
    error.statusCode = 500;
    return next(error);
  }

  try {
    // sending the email
    const nodeEmail = {
      from: 'btsvie@outlook.com',
      to: email,
      subject: 'Password Reset',
      html: `
          <p> You requested a password reset </p>
          <p> Click this <a href="http://192.168.1.5:3000/new-password/${token}">link</a> to set a new password </p>
          <p> The link will be valid for 1 hour </p>
        `,
    };

    transporter.sendMail(nodeEmail, function (err, info) {
      if (err) {
        console.log(err);
        return;
      }
      console.log('sent: ' + info.response);
    });
  } catch (err) {
    const error = new Error('sending reset email error');
    error.statusCode = 500;
    return next(error);
  }
  res.status(200).json({
    message: 'email reset sent successfully!',
  });
};

// verifying the password page through token
exports.getPasswordPage = async (req, res, next) => {
  let token = req.params.token;

  let user;
  try {
    user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }, // checking if token expiration date is not expired yet
    });
    if (!user) {
      const error = new Error('token is invalid');
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    const error = new Error('reseting password failed');
    error.statusCode = 500;
    return next(error);
  }
  res.status(200).json({
    userId: user._id,
    message: 'email reset sent successfully!',
  });
};

// posting the password change through the reset password page
exports.postNewPassword = async (req, res, next) => {
  const token = req.params.token;
  const { userId, newPassword } = req.body;

  let user;
  try {
    //     we want a user that
    //     1. has the same resetToken as the token passed from the url in the get page
    //     2. the token fetched hasn't expired yet
    //     3. the id matched
    user = await User.findOne({
      _id: mongoose.Types.ObjectId(userId),
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      const error = new Error('user not found or token is invalid');
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    const error = new Error('reseting password failed');
    error.statusCode = 500;
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
  } catch (err) {
    const error = new Error('reseting password failed');
    error.statusCode = 500;
    return next(error);
  }

  try {
    // sending the email
    const nodeEmail = {
      from: 'btsvie@outlook.com',
      to: user.email,
      subject: 'password changed!',
      html: `
        <h1>You successfully change your password!</h1>
        `,
    };

    transporter.sendMail(nodeEmail, function (err, info) {
      if (err) {
        console.log(err);
        return;
      }
      console.log('sent: ' + info.response);
    });
  } catch (err) {
    const error = new Error('sending reset email error');
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json({
    message: 'password changed!',
  });
};

exports.verifyAccount = async (req, res, next) => {
  const token = req.params.token;
  let user;
  try {
    user = await User.findOne({
      verificationToken: token,
    });
    if (!user) {
      const error = new Error('user not found');
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    const error = new Error('verifying account failed');
    error.statusCode = 500;
    return next(error);
  }

  try {
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
  } catch (err) {
    const error = new Error('verifying account failed');
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json({
    message: 'account verifed!',
  });
};

exports.getUser = async (req, res, next) => {
  let user;
  let acronym;
  try {
    user = await User.findById(req.userId).select(
      'userName email notifications imageUrl'
    );
    if (!user) {
      const error = new Error('cannot find the user with provided id');
      error.statusCode = 404;
      return next(error);
    }
    var matches = user.userName.match(/\b(\w)/g); // ['J','S','O','N']
    acronym = matches.join('').slice(0, 2); // JSON
  } catch (err) {
    const error = new Error('getting account failed');
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json({
    user: user,
    userInitial: acronym,
  });
};

exports.editUser = async (req, res, next) => {
  const userId = req.params.userId;
  const { userName, email, password } = req.body;
  let user;
  try {
    user = await User.findById(userId);
    if (!user) {
      const error = new Error('cannot find the user with provided id');
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    const error = new Error('editing account failed');
    error.statusCode = 500;
    return next(error);
  }

  try {
    let comparingPass = await bcrypt.compare(password, user.password);
    if (!comparingPass) {
      // if the password doesn't matched
      const error = new Error("password doesn't match!");
      error.statusCode = 401;
      return next(error);
    }
  } catch (err) {
    const error = new Error('editing account failed');
    error.statusCode = 500;
    return next(error);
  }
  let emailChange = false;
  try {
    if (user.email !== email) {
      let token = crypto.randomBytes(32).toString('hex');
      user.email = email;
      user.verified = false;
      user.verificationToken = token;
      emailChange = true;
      const nodeEmail = {
        from: 'btsvie@outlook.com',
        to: email,
        subject: 'Email change request!',
        html: `
      <p> Click this <a href="http://192.168.1.5:3000/verify-account/${token}">link</a> to verify your account </p>
      `,
      };
      transporter.sendMail(nodeEmail, function (err, info) {
        if (err) {
          console.log(err);
          return;
        }
        console.log('sent: ' + info.response);
      });
    }
    user.userName = userName;
    await user.save();
  } catch (err) {
    const error = new Error('editing account failed');
    error.statusCode = 500;
    return next(error);
  }

  if (emailChange) {
    res.status(201).json({
      user: user,
    });
  } else {
    res.status(200).json({
      user: user,
    });
  }
};

exports.editPassword = async (req, res, next) => {
  const userId = req.params.userId;
  const { currentPassword, newPassword } = req.body;

  let user;
  try {
    user = await User.findById(userId);
    if (!user) {
      const error = new Error("the user doesn't exist!");
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    const error = new Error('editing password failed');
    error.statusCode = 500;
    return next(error);
  }

  let checkPass;
  try {
    checkPass = await bcrypt.compare(currentPassword, user.password);
    if (!checkPass) {
      // if the password doesn't matched
      const error = new Error("password doesn't match!");
      error.statusCode = 401;
      return next(error);
    }
  } catch (err) {
    const error = new Error('editing password failed');
    error.statusCode = 500;
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
  } catch (err) {
    const error = new Error('editing password failed');
    error.statusCode = 500;
    return next(error);
  }

  res.status(201).json({
    message: 'password changed!',
  });
};
