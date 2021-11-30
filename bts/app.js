require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const ticketRouter = require('./routers/tickets')

const app = express();

app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next();
})


app.use('/project', ticketRouter);

mongoose
  .connect(process.env.MONGO_SERVER)
  .then((res) => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
