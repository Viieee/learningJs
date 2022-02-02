const Project = require('../models/project');
const Ticket = require('../models/ticket');

exports.postRequest = async (req, res, next) => {
  const { projectId } = req.params;
  const { description, status, priority, type } = req.body;

  let project;
  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new Error(
      'posting ticket failed through api failed, please try again.'
    );
    error.statusCode = 500;
    return next(error);
  }

  let newTicket = new Ticket({
    title: '<Api Request>',
    description: description,
    status: status || 'New',
    priority: priority || 'Medium',
    type: type || 'Bug',
    assignedDevs: [],
    project: projectId,
    creator: project.creator,
    timeEnd: new Date(new Date().getTime() + 1000 * 60 * 60), // string
  });

  try {
    await newTicket.save();
  } catch (err) {
    const error = new Error('posting ticket failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    project.tickets.push(newTicket._id);
    await project.save();
  } catch (err) {
    const error = new Error('posting ticket failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  res.status(201).json({ message: 'request sent!' });
};
