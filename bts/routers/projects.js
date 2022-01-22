const express = require('express');

const Router = express.Router();

const projectController = require('../controllers/projects');
const checkAuth = require('../middleware/check-auth');

Router.use(checkAuth);

// get /project/
Router.get('/', projectController.getProjects);

// post /project/
Router.post('/', projectController.postProject);

// get /project/:projectId
Router.get('/:projectId', projectController.getAProject);

// put /project/:projectId
Router.patch('/:projectId', projectController.editProject);

// delete /project/:projectId
Router.delete('/:projectId', projectController.deleteProject);

// post /project/:projectId/member
Router.post('/:projectId/member', projectController.addingMember);

// post /project/:projectId/ticket
Router.post('/:projectId/ticket', projectController.addingTicket);

// post /project/:projectId/leave
Router.post('/:projectId/leave', projectController.leaveProject);

module.exports = Router;
