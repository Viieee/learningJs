require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const ticketRouter = require('./routers/tickets');
const authRouter = require('./routers/auth');

const app = express();

app.use(bodyParser.json()); // parsing incoming json data

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRouter);
app.use('/project', ticketRouter);

// error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.statusCode;
  const message = error.message;
  const data = error.data;
  res.status(statusCode).json({ message: message, data: data });
});

mongoose
  .connect(process.env.MONGO_SERVER)
  .then((res) => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
