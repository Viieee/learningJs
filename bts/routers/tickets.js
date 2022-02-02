const express = require('express');

const Router = express.Router();

const ticketController = require('../controllers/tickets');
const checkAuth = require('../middleware/check-auth');

Router.use(checkAuth);

// get /ticket/
Router.get('/', ticketController.getTickets);

// get /ticket/:ticketId
Router.get('/:ticketId', ticketController.getATicket);

// patch /ticket/:ticketId/
Router.patch('/:ticketId', ticketController.editTicket);

// delete  /ticket/:ticketId/
Router.delete('/:ticketId', ticketController.deleteTicket);

// post /ticket/:ticketId/comment
Router.post('/:ticketId/comment', ticketController.addComment);

// delete /ticket/:ticketId/comment
Router.delete('/:ticketId/comment/:commentId', ticketController.deleteComment);

module.exports = Router;
