require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const ticketRouter = require('./routers/tickets');
const projectRouter = require('./routers/projects');
const authRouter = require('./routers/auth');
const apiRouter = require('./routers/api');

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
app.use('/api', apiRouter);

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
        if (io.sockets.adapter.rooms.has(room)) {
          // userJoin(socket.id, username, room);
          socket.join(user.room);
        } else {
          console.log(
            socket.id +
              ' tried to join ' +
              room +
              ' but the room does not exist.'
          );
          // Socket.join is not executed, hence the room not created.
        }
        console.log('this is user', user);
        socket.join(user.room);
      });
      socket.on('addProject', ({ project }) => {
        socket.emit('loadProject', {
          project,
        });
      });
      socket.on('addMemberList', ({ member }) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('member', {
          member,
        });
      });
      socket.on('deleteMemberList', ({ member }) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('deletedMember', {
          member,
        });
      });
      socket.on('addTicket', ({ ticket }) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('ticket', {
          ticket,
        });
      });
      socket.on('deleteTicket', ({ ticket }) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('deletedTicket', {
          ticket,
        });
      });
      socket.on('addComment', ({ comment }) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('comment', {
          comment,
        });
      });
      socket.on('deleteComment', ({ comment }) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('deletedComment', {
          comment,
        });
      });
      socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        console.log('client disconnected');
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
