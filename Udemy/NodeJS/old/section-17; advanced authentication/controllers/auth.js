// importing bcrypt
const bcrypt = require('bcryptjs');
const { post } = require('superagent');
// importing nodemailer
const nodemailer = require('nodemailer')
//importing the transporter
const mandrillTransporter = require('nodemailer-mandrill-transport')

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  mandrillTransporter({
    auth: {
      apiKey:
        'edHUPRKFpGeYzggD0ieC5A'
    }
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error'); // this error will only be stored if theres an error in the login process
                                    // and later will be removed from the session

  if(message.length > 0){
    message = message[0]
  }else{
    message = null
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error'); // this error will only be stored if theres an error in the login process
                                    // and later will be removed from the session

  if(message.length > 0){
    message = message[0]
  }else{
    message = null
  }

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  // User.findById('60c5395ba98da70520a7b8ee')
  User.findOne({email: email})
  .then(user => {
    if (!user){
      // error message
      req.flash('error', 'Invalid Email or password.')
      // if the email is not registered/stored in the database
      return res.redirect('/login')
    }
    
    // passing the password to bcrypt to then compare it to the hashed password
    bcrypt
    .compare(password, user.password)
    .then(doMatch=>{
      if(doMatch){
        // password valid
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(err => {
          console.log(err);
          res.redirect('/')
        });
      }
      // if the password is invalid
      req.flash('error', 'Invalid Email or password.')
      res.redirect('/login')
    })
    .catch(err=>{
      console.log(err)
      res.redirect('/login')
    })
  })
  .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  // retrieving data from form
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // finding if a user with the email in the request already exist in our database
  User.findOne({email: email})
  .then(userDoc=>{
    // we getting the user data back with the email entered in form
    if(userDoc){
      // if a user with the same email already exist in the database
      req.flash('error', 'Email already registered!')
      return res.redirect('/signup')
    }

    // hashing password, it's a promise
    // first argument is the thing we want to hash
    // second argument is the amount of hashing we want to do
    // we will return it and passing the data into then block
    return bcrypt.hash(password, 12) 
    .then(hashedPassword=>{
      // if theres no user with the email entered
      const user = new User({
        // user schema, look at the model
        email: email,
        password: hashedPassword,
        cart:{
          items: []
        }
      })
      // saving the user
      return user.save()
    });
  })
  .then(result=>{
    let mailOptions={
      from : 'vieri@mhs.dinus.ac.id',
      to : email,
      subject : "This is from Mandrill",
      html : "Hello,<br>Sending this email using Node and Mandrill"
   };
   
   // Sending email.
   return transporter.sendMail(mailOptions, function(error, response){
     if(error) {
        throw new Error("Error in sending email");
     }
     console.log("Message sent: " + JSON.stringify(response));
   });
  })
  .then(result=>{
    res.redirect('/login')
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
