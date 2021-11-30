const express = require('express');

const Router = express.Router()

const ticketController = require('../controllers/tickets')

// get /project/ticket/
Router.get('/ticket', ticketController.getTickets)

module.exports =  Router