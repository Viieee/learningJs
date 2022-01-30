const express = require('express');

const Router = express.Router();

const projectController = require('../controllers/projects');
const checkAuth = require('../middleware/check-auth');
const project = require('../models/project');

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

// patch /project/:projectId/member/:userId
Router.patch('/:projectId/member/:userId', projectController.editRole);

// delete /project/:projectId/member/:userId
Router.delete('/:projectId/member/:userId', projectController.removeMember);

// post /project/:projectId/ticket
Router.post('/:projectId/ticket', projectController.addingTicket);

// post /project/:projectId/leave
Router.post('/:projectId/leave', projectController.leaveProject);

// get get /project/:projectId/Key
Router.get('/:projectId/key', projectController.getKey);

// get /project/:projectId/apiKey
Router.get('/:projectId/apiKey', projectController.createApiKey);

// delete /project/:projectId/apiKey
Router.delete('/:projectId/apiKey', projectController.deleteApiKey);

module.exports = Router;
