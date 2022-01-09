const express = require('express');

const Router = express.Router();

const projectController = require('../controllers/projects');

// get /project/
Router.get('/', projectController.getProjects);

// post /project/ticket
Router.post('/', projectController.postProject);

module.exports = Router;