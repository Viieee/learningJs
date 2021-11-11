const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
// ? import { v4 as uuidv4 } from 'uuid';

const app = express();

// configuring multer
const fileStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    // ! configuring the path of the file
    // ? if we dont save it in a destination (folder),
    //    it will be saved in the buffer
    callback(null, 'images');
  },
  filename: function (req, file, callback) {
    // ! configuring the filename
    callback(
      null,
      // uuidv4() + file.originalname
      new Date().toISOString().slice(0, 10) + '-' + file.originalname
    );
  },
});

// filtering file for multer
const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    callback(null, true); // if we want to store it
  } else {
    callback(null, false); // if we dont want to store it
  }
};

// routes
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

app.use(bodyParser.json()); // parsing incoming json data
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image') // single file in a field called 'image'
);
app.use('/images', express.static(path.join(__dirname, 'images'))); // serving the image files statically

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // to any client allowed access
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  ); // the request methods allowed
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

// ! error handling middleware, will only be reached if an error thrown/next(err) called
app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.statusCode;
  const message = error.message; // exist by default
  const data = error.data;
  res.status(statusCode).json({ message: message, data: data });
});

mongoose
  .connect(
    'mongodb+srv://vieri:pass123.@cluster0.6o5cb.mongodb.net/belajarAPI?retryWrites=true&w=majority'
  )
  .then((res) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });

// const getButton = document.getElementById('get')
// const postButton = document.getElementById('post')

// getButton.addEventListener('click', ()=>{
//   fetch('http://localhost:8080/feed/posts')
//   .then(res => res.json()) // waiting for the body to be completely streamed and convert it to js object )
//   .then(resData => console.log(resData))
//   .catch(err=>{
//     console.log(err)
//   })
// })

/* <button id='get'>get posts</button>
<button id='post'>create post</button> */
