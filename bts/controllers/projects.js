const Ticket = require('../models/ticket');
const Project = require('../models/project');
const User = require('../models/user');
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

exports.getProjects = async (req, res, next) => {
  let currentUserProjects;
  try {
    currentUserProjects = await User.findById(req.userId).populate({
      path: 'projects',
      populate: { path: 'creator', select: 'userName' },
    });
  } catch (err) {
    const error = new Error('getting projects failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json({
    message: 'projects fetched successfully!',
    projects: currentUserProjects.projects,
  });
};

exports.postProject = async (req, res, next) => {
  // getting the input from the front end
  const { title, description } = req.body;

  let userName;

  try {
    userName = await User.findById(req.userId).select('userName');
  } catch (err) {
    const error = new Error('creating project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  let apiKey;
  try {
    apiKey = await bcrypt.hash(crypto.randomUUID(), 12);
  } catch (err) {
    const error = new Error('creating project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  const newProject = new Project({
    title,
    description,
    creator: req.userId,
    members: [],
    tickets: [],
    apiKey: apiKey,
  });

  let user;

  try {
    user = await User.findById(req.userId);
  } catch (err) {
    const error = new Error('creating project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  if (!user) {
    const error = new Error('could not find user for provided id');
    error.statusCode = 404;
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newProject.members.push({ member: req.userId, role: 'admin' });
    await newProject.save({ session: sess });
    await Project.populate(newProject, { path: 'creator', select: 'userName' });
    user.projects.push(newProject);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new Error('creating project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }
  res.status(201).json({ project: newProject });
};

exports.getAProject = async (req, res, next) => {
  const projectId = req.params.projectId;

  let project;
  try {
    project = await Project.findById(projectId)
      .populate({
        path: 'creator',
        select: 'userName',
      })
      .populate({ path: 'members.member', select: 'userName email' })
      .populate({
        path: 'tickets',
        populate: {
          path: 'creator project assignedDevs',
          select: 'userName title',
        },
      });
    if (!project) {
      const error = new Error('getting project failed, please try again.');
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    const error = new Error('getting project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    const memberInside = await project.members.find(
      (member) => member.member._id.toString() === req.userId
    );
    if (!memberInside) {
      const error = new Error('unauthorized.');
      error.statusCode = 401;
      return next(error);
    }
  } catch (err) {
    const error = new Error('getting project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }
  res.status(201).json({ project: project });
};

exports.editProject = async (req, res, next) => {
  const projectId = req.params.projectId;
  const { title, description } = req.body;
  let project;
  try {
    project = await Project.findById(projectId);
    if (project.creator.toString() !== req.userId.toString()) {
      const error = new Error('not authorized.');
      error.statusCode = 403;
      return next(error);
    }
  } catch (err) {
    const error = new Error('editing project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    project.title = title;
    project.description = description;
    await project.save();
  } catch (err) {
    const error = new Error('editing project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }
  res
    .status(200)
    .json({ message: 'project updated successfully!', project: project });
};

exports.deleteProject = async (req, res, next) => {
  const projectId = req.params.projectId;

  let project;

  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new Error('deleting project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  if (!project) {
    const error = new Error('could not find project for provided id');
    error.statusCode = 404;
    return next(error);
  }

  let members = [];
  try {
    members.push(...project.members);
  } catch (err) {
    const error = new Error('deleting project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    // removing project from each member
    members.map(async (member) => {
      let user = await User.findById(member.member);
      await user.projects.pull(projectId);
      await user.save();
    });
  } catch (err) {
    const error = new Error('deleting project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    await Project.findByIdAndRemove(projectId);
  } catch (err) {
    const error = new Error('deleting project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }
  res.status(200).json({ message: 'deleted post.' });
};

exports.addingMember = async (req, res, next) => {
  const projectId = req.params.projectId;
  const { email } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("user doesn't exist");
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    const error = new Error('adding member failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  let project;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    project = await Project.findById(projectId);
    await project.members.push({ member: user._id, role: 'dev' });
    await project.save({ session: sess });
    await user.projects.push(project);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new Error('adding member failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }
  res.status(201).json({ message: 'user added!' });
};

exports.leaveProject = async (req, res, next) => {
  const projectId = req.params.projectId;

  let project;

  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new Error('leaving project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  if (!project) {
    const error = new Error('could not find project for provided id');
    error.statusCode = 404;
    return next(error);
  }

  let user;
  try {
    user = await User.findById(req.userId);
    await user.projects.pull(projectId);
    await user.save();
  } catch (err) {
    const error = new Error('leaving project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    const filteredMember = await project.members.filter((member) => {
      if (member.member.toString() !== req.userId.toString()) {
        return member;
      }
    });
    project.members = filteredMember;
    project.save();
  } catch (err) {
    const error = new Error('leaving project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json({ message: 'left project.' });
};

exports.addingTicket = async (req, res, next) => {
  const projectId = req.params.projectId;
  const { title, description, status, priority, type, assignedDevs, timeEnd } =
    req.body;

  let currentDate = new Date();
  let currentHour = currentDate.getHours();
  let endDate = currentDate.setHours(currentHour + +timeEnd);

  console.log(currentDate);
  console.log(currentHour);
  console.log(endDate);

  let newTicket = new Ticket({
    title: title,
    description: description,
    status: status,
    priority: priority,
    type: type,
    assignedDevs: assignedDevs,
    project: projectId,
    creator: req.userId,
    timeEnd: endDate,
  });

  try {
    await newTicket.save();
  } catch (err) {
    const error = new Error('posting ticket failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  let user;
  try {
    user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('could not find user for provided id');
      error.statusCode = 404;
      return next(error);
    }
    user.tickets.push(newTicket._id);
    await user.save();
  } catch (err) {
    const error = new Error('posting ticket failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  let project;
  try {
    project = await Project.findById(projectId);
    project.tickets.push(newTicket._id);
    await project.save();
  } catch (err) {
    const error = new Error('posting ticket failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    if (assignedDevs.length > 0) {
      const devs = assignedDevs.filter((dev) => {
        // User.findById
        if (dev.toString() !== newTicket.creator.toString()) {
          return dev;
        }
      });
      devs.map(async (dev) => {
        let user = await User.findById(dev);
        await user.tickets.push(newTicket._id);
        await user.save();
      });
    }
  } catch (err) {
    const error = new Error('posting ticket failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    await Ticket.populate(newTicket, {
      path: 'creator',
      select: 'userName',
    })
      .populate(newTicket, { path: 'project', select: 'title' })
      .populate(newTicket, {
        path: 'assignedDevs',
        select: 'userName',
      });
  } catch (err) {
    const error = new Error('posting ticket failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  res.status(201).json({ ticket: newTicket });
};
