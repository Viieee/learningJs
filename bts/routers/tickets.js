const express = require('express');

const Router = express.Router();

const ticketController = require('../controllers/tickets');

// get /project/ticket
Router.get('/ticket', ticketController.getTickets);

// post /project/ticket
Router.post('/ticket', ticketController.postTicket);

module.exports = Router;
