require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const ticketRouter = require('./routers/tickets');
const projectRouter = require('./routers/projects');
const authRouter = require('./routers/auth');

// socket io utils
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users');

const app = express();

app.use(bodyParser.json()); // parsing incoming json data

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE' // the api request allowed
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRouter);
app.use('/project', projectRouter);
app.use('/ticket', ticketRouter);

app.use((req, res, next) => {
  const error = new Error('Could not find this route.');
  error.statusCode = 404;
  throw error;
});

// error handling middleware
app.use((error, req, res, next) => {
  const statusCode = error.statusCode;
  const message = error.message;
  const data = error.data;
  res.status(statusCode).json({ message: message, data: data });
});

mongoose
  .connect(process.env.MONGO_SERVER)
  .then((res) => {
    const server = app.listen(8080); // ? node server
    // websocket
    const io = require('./socket').init(server);
    io.on('connection', (socket) => {
      // ? socket parameter is connection between server and client
      // ? this function will be executed for every new client connected
      console.log('client connected');

      socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        console.log(user);
        socket.join(user.room);
      });
      socket.on('addProject', ({ project }) => {
        socket.emit('loadProject', {
          project,
        });
      });
      socket.on('disconnect', () => {
        console.log('client disconnected');
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
