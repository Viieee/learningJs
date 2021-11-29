const express = require('express');
const mongoose = require('mongoose');

const ticketRouter = require('./routers/tickets')

require('dotenv').config();

const app = express();

app.use('/project', ticketRouter)

mongoose
  .connect(process.env.MONGO_SERVER)
  .then((res) => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
