const jwt = require('jsonwebtoken');
const Project = require('../models/project');
const bcrypt = require('bcryptjs');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const apiKey = req.headers.authorization.split(' ')[1];
    if (!apiKey) {
      throw new Error('Authentication failed!');
    }
    let project = await Project.findById(req.params.projectId);
    let comparingKey = await bcrypt.compare(apiKey, project.apiKey);
    if (!comparingKey) {
      // if the password doesn't matched
      const error = new Error("password doesn't match!");
      error.statusCode = 401;
      return next(error);
    }
    next();
  } catch (err) {
    const error = new Error('Authentication failed!');
    error.statusCode = 403;
    return next(error);
  }
};
