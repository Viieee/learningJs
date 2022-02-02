const Ticket = require('../models/ticket');
const Project = require('../models/project');
const User = require('../models/user');
const Notification = require('../models/notification');
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const schedule = require('node-schedule');
const ticket = require('../models/ticket');

exports.getProjects = async (req, res, next) => {
  let currentUserProjects;
  try {
    currentUserProjects = await User.findById(req.userId).populate({
      path: 'projects',
      populate: { path: 'creator', select: 'userName' },
    });
    if (!currentUserProjects) {
      const error = new Error('user not found');
      error.statusCode = 404;
      return next(error);
    }
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
  let user;

  try {
    user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('user not found');
      error.statusCode = 404;
      return next(error);
    }
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
  });

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

  let memberInside;
  try {
    memberInside = await project.members.find(
      (member) => member.member._id.toString() === req.userId.toString()
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

  res.status(201).json({ project: project, role: memberInside.role });
};

exports.editProject = async (req, res, next) => {
  const projectId = req.params.projectId;
  const { title, description } = req.body;
  let project;
  try {
    project = await Project.findById(projectId).populate({
      path: 'members.member',
      select: 'userName, email',
    });
    if (!project) {
      const error = new Error('project not found');
      error.statusCode = 404;
      return next(error);
    }
    let adminList = project.members.filter((member) => {
      if (member.role === 'admin') {
        return member;
      }
    });
    let checkingUser = await adminList.find(
      (member) => member.member._id.toString() === req.userId.toString()
    );
    if (!checkingUser) {
      const error = new Error('unauthorized.');
      error.statusCode = 401;
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

exports.getKey = async (req, res, next) => {
  const projectId = req.params.projectId;
  let project;
  try {
    project = await Project.findById(projectId);
    if (!project) {
      const error = new Error('cannot find project with the provided id');
      error.statusCode = 404;
      return next(error);
    }
    if (project.creator.toString() !== req.userId.toString()) {
      const error = new Error('unauthorized.');
      error.statusCode = 401;
      return next(error);
    }
  } catch (err) {
    const error = new Error('getting api key failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }
  res
    .status(200)
    .json({ message: 'apiKey retrieved', apiKey: project.apiPrefix });
};

exports.createApiKey = async (req, res, next) => {
  const projectId = req.params.projectId;
  let project;
  try {
    project = await Project.findById(projectId);
    if (!project) {
      const error = new Error('cannot find project with the provided id');
      error.statusCode = 404;
      return next(error);
    }
    if (project.creator.toString() !== req.userId.toString()) {
      const error = new Error('unauthorized.');
      error.statusCode = 401;
      return next(error);
    }
  } catch (err) {
    const error = new Error('getting api key failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  let apiKey;
  let hashedApiKey;
  try {
    apiKey = crypto.randomBytes(32).toString('hex');
    project.apiPrefix = apiKey.slice(0, 3);
    hashedApiKey = await bcrypt.hash(apiKey, 12);
  } catch (err) {
    const error = new Error('getting api key failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    project.apiKey = hashedApiKey;
    await project.save();
  } catch (err) {
    const error = new Error('getting api key failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json({ message: 'apiKey retrieved', apiKey: apiKey });
};

exports.deleteApiKey = async (req, res, next) => {
  const projectId = req.params.projectId;
  let project;
  try {
    project = await Project.findById(projectId);
    if (!project) {
      const error = new Error('cannot find project with the provided id');
      error.statusCode = 404;
      return next(error);
    }
    if (project.creator.toString() !== req.userId.toString()) {
      const error = new Error('unauthorized.');
      error.statusCode = 401;
      return next(error);
    }
  } catch (err) {
    const error = new Error('deleting api key failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    project.apiKey = null;
    project.apiPrefix = undefined;
    await project.save();
  } catch (err) {
    const error = new Error('deleting api key failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }
  res.status(200).json({ message: 'apiKey deleted' });
};

exports.deleteProject = async (req, res, next) => {
  const projectId = req.params.projectId;
  let project;
  try {
    project = await Project.findById(projectId).populate({
      path: 'tickets',
    });
    if (!project) {
      const error = new Error('project not found');
      error.statusCode = 404;
      return next(error);
    }
    // console.log(project);
    if (project.creator.toString() !== req.userId.toString()) {
      const error = new Error('unauthorized.');
      error.statusCode = 401;
      return next(error);
    }
  } catch (err) {
    const error = new Error('deleting project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  let creator;
  // deleting tickets of project from project members and project creator
  try {
    project.tickets.map(async (ticket) => {
      let filteredDevs = await ticket.assignedDevs.filter((dev) => {
        if (ticket.creator.toString() !== dev.toString()) {
          return dev;
        }
      });
      filteredDevs.map(async (dev) => {
        let currentDev = await User.findById(dev);
        if (!currentDev) {
          const error = new Error('user not found');
          error.statusCode = 404;
          return next(error);
        }
        await currentDev.tickets.pull(ticket._id);
        await currentDev.save();
      });
      creator = await User.findById(ticket.creator);
      if (!creator) {
        const error = new Error('user not found');
        error.statusCode = 404;
        return next(error);
      }
      creator.tickets.pull(ticket._id);
      await creator.save();
    });
  } catch (err) {
    const error = new Error('deleting project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  // deleting tickets
  try {
    project.tickets.map(async (ticket) => {
      await Ticket.findByIdAndDelete(ticket._id);
    });
  } catch (err) {
    const error = new Error('deleting project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  // deleting project from each member
  try {
    project.members.map(async (member) => {
      let user = await User.findById(member.member);
      if (!user) {
        const error = new Error('user not found.');
        error.statusCode = 404;
        return next(error);
      }
      user.projects.pull(projectId);
      await user.save();
    });
  } catch (err) {
    const error = new Error('deleting project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  // deleting project
  try {
    await Project.findByIdAndDelete(projectId);
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
    user = await User.findOne({ email: email }).select(
      'userName notifications projects'
    );
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
    project = await Project.findById(projectId).populate({
      path: 'members.member',
      select: 'userName email',
    });
    if (!project) {
      const error = new Error('project not found');
      error.statusCode = 404;
      return next(error);
    }
    let adminList = project.members.filter((member) => {
      if (member.role === 'admin') {
        return member;
      }
    });
    let checkingUser = await adminList.find(
      (member) => member.member._id.toString() === req.userId.toString()
    );
    if (!checkingUser) {
      const error = new Error('unauthorized.');
      error.statusCode = 401;
      return next(error);
    }
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

  let notification = new Notification({
    title: 'Added to a New Project',
    description: 'Someone Added you to a new project, check it out!',
    to: user._id,
    read: false,
    customLink: `project/${projectId}`,
  });
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await notification.save({ session: sess });
    await user.notifications.push(notification);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new Error('adding member failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  let dataSocket;
  try {
    dataSocket = project.members.find((member) => {
      if (member.member._id.toString() === user._id.toString()) {
        return member;
      }
    });
  } catch (err) {
    const error = new Error('adding member failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }
  res.status(201).json({
    message: 'user added!',
    member: {
      member: user,
      role: dataSocket.role,
    },
  });
};

exports.editRole = async (req, res, next) => {
  const projectId = req.params.projectId;
  const userId = req.params.userId;

  const { role } = req.body;

  let project;
  let memberInside;
  try {
    project = await Project.findById(projectId).populate({
      path: 'members.member',
      select: 'userName email',
    });
    if (!project) {
      const error = new Error('project not found');
      error.statusCode = 404;
      return next(error);
    }
    memberInside = await project.members.find(
      (member) => member.member._id.toString() === userId.toString()
    );
    if (!memberInside) {
      const error = new Error('member not found.');
      error.statusCode = 404;
      return next(error);
    }
    if (role !== memberInside.role) {
      memberInside.role = role;
      await project.save();
    }
  } catch (err) {
    const error = new Error('editing role failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }
  res.status(201).json({ message: 'role edited!' });
};

exports.leaveProject = async (req, res, next) => {
  const projectId = req.params.projectId;

  let project;

  try {
    project = await Project.findById(projectId).populate({
      path: 'tickets',
      select: 'assignedDevs',
    });
    if (!project) {
      const error = new Error('project not found');
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    const error = new Error('leaving project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  let user;
  try {
    user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('user not found');
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    const error = new Error('leaving project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    project.tickets.map(async (ticket) => {
      let currentTicket = await Ticket.findById(ticket._id);
      if (!currentTicket) {
        const error = new Error('ticket not found');
        error.statusCode = 404;
        return next(error);
      }
      await currentTicket.assignedDevs.pull(req.userId);
      await currentTicket.save();
      await user.tickets.pull(ticket._id);
    });
  } catch (err) {
    const error = new Error('leaving project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
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
    await project.save();
  } catch (err) {
    const error = new Error('leaving project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    if (project.members.length === 0) {
      await Project.findByIdAndRemove(projectId);
    }
  } catch (err) {
    const error = new Error('leaving project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json({ message: 'left project.' });
};

exports.removeMember = async (req, res, next) => {
  const { projectId, userId } = req.params;

  let project;
  try {
    project = await Project.findById(projectId)
      .populate({
        path: 'tickets',
        select: 'assignedDevs',
      })
      .populate({ path: 'members.member', select: 'userName email' });
    let adminList = project.members.filter((member) => {
      if (member.role === 'admin') {
        return member;
      }
    });
    let checkingUser = await adminList.find(
      (member) => member.member._id.toString() === req.userId.toString()
    );
    if (!checkingUser) {
      const error = new Error('unauthorized.');
      error.statusCode = 401;
      return next(error);
    }
  } catch (err) {
    const error = new Error('leaving project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  let user;
  try {
    user = await User.findById(userId);
    if (!user) {
      const error = new Error('user not found');
      error.statusCode = 404;
      return next(error);
    }
    // console.log(user);
  } catch (err) {
    const error = new Error('leaving project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    // deleting user from project's ticket
    project.tickets.map(async (ticket) => {
      let currentTicket = await Ticket.findById(ticket._id);
      if (!currentTicket) {
        const error = new Error('ticket not found');
        error.statusCode = 404;
        return next(error);
      }
      await currentTicket.assignedDevs.pull(user._id);
      await currentTicket.save();
      await user.tickets.pull(ticket._id);
    });
  } catch (err) {
    const error = new Error('leaving project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    await user.projects.pull(projectId);
    await user.save();
  } catch (err) {
    const error = new Error('leaving project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    const filteredMember = await project.members.filter((member) => {
      if (member.member._id.toString() !== userId.toString()) {
        return member;
      }
    });
    project.members = filteredMember;
    await project.save();
  } catch (err) {
    const error = new Error('leaving project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    if (project.members.length === 0) {
      await Project.findByIdAndRemove(projectId);
    }
  } catch (err) {
    const error = new Error('leaving project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json({ message: 'member removed.', userId: user._id });
};

exports.addingTicket = async (req, res, next) => {
  const projectId = req.params.projectId;
  const { title, description, status, priority, type, assignedDevs, timeEnd } =
    req.body;

  let project;
  try {
    project = await Project.findById(projectId).populate({
      path: 'members.member',
      select: 'userName, email',
    });
    if (!project) {
      const error = new Error('project not found');
      error.statusCode = 404;
      return next(error);
    }
    let adminList = project.members.filter((member) => {
      if (member.role === 'admin') {
        return member;
      }
    });
    let checkingUser = await adminList.find(
      (member) => member.member._id.toString() === req.userId.toString()
    );
    if (!checkingUser) {
      const error = new Error('unauthorized.');
      error.statusCode = 401;
      return next(error);
    }
  } catch (err) {
    const error = new Error('posting ticket failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  let newTicket = new Ticket({
    title: title,
    description: description,
    status: status,
    priority: priority,
    type: type,
    assignedDevs: assignedDevs,
    project: projectId,
    creator: req.userId,
    timeEnd: timeEnd, // string
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
    user = await User.findById(req.userId).select('userName tickets');
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

  try {
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
        if (!user) {
          const error = new Error('user not found');
          error.statusCode = 404;
          return next(error);
        }
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
    const date = new Date(new Date(timeEnd).getTime() - 1000 * 60 * 60);

    const job = schedule.scheduleJob(date, function () {
      assignedDevs.map(async (dev) => {
        let user = await User.findById(dev);
        let scheduledNoti = new Notification({
          title: 'Ticket Deadline Coming Soon!',
          description:
            'one of your ticket deadline is coming very soon, make sure you get it done!',
          to: dev,
          read: false,
          customLink: `project/${projectId}/ticket/${newTicket._id}`,
        });
        await scheduledNoti.save();
        user.notifications.push(scheduledNoti);
        await user.save();
      });
    });
  } catch (err) {
    const error = new Error('posting ticket failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  // res.status(201).json({ ticket: newTicket });
  res.status(201).json({
    ticket: {
      title: newTicket.title,
      description: newTicket.description,
      status: newTicket.status,
      creator: user,
    },
  });
};
