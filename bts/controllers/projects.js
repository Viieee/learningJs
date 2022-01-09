const Ticket = require('../models/ticket');
const Project = require('../models/project');

exports.getProjects = (req, res, next) => {
  Project.find().then((projects) => {
    res
      .status(200)
      .json({ message: 'projects fetched successfully!', projects: projects });
  });
};

exports.postProject = (req, res, next) => {
  // getting the input from the front end
  const { title, description } = req.body;

  const newProject = new Project({
    title,
    description,
    creator: 'vDummy',
    members: [],
    tickets: [],
    apiKey: 'dummyKey',
  });

  newProject
    .save()
    .then(res.status(201).json({ project: newProject }))
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // ! in async code you need to do this to reach the error handling middleware
    });
};
