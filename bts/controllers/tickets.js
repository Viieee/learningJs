const Ticket = require('../models/ticket');
const User = require('../models/user');
const Project = require('../models/project');
const mongoose = require('mongoose');

exports.getTickets = async (req, res, next) => {
  let currentUserTickets;
  try {
    currentUserTickets = await User.findById(req.userId).populate({
      path: 'tickets',
      select: 'project title priority status timeEnd',
      populate: { path: 'project', select: 'title' },
    });

    if (!currentUserTickets) {
      const error = new Error('user with id not found');
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    const error = new Error('getting tickets failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json({
    message: 'projects fetched successfully!',
    tickets: currentUserTickets.tickets,
  });
};

exports.getATicket = async (req, res, next) => {
  const ticketId = req.params.ticketId;
  let ticket;
  try {
    ticket = await Ticket.findById(ticketId)
      .populate({
        path: 'creator project assignedDevs comments.creator',
        select: 'userName title members',
      })
      .sort({ 'comments.createdAt': -1 });

    if (!ticket) {
      const error = new Error('ticket not found');
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    const error = new Error('getting ticket detail failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    const memberInside = await ticket.project.members.find(
      (member) => member.member._id.toString() === req.userId.toString()
    );

    if (!memberInside) {
      const error = new Error('unauthorized.');
      error.statusCode = 401;
      return next(error);
    }
  } catch (err) {
    const error = new Error('getting tickets failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json({
    message: 'projects fetched successfully!',
    ticket: ticket,
  });
};

exports.editTicket = async (req, res, next) => {
  const ticketId = req.params.ticketId;
  const { title, description, status, priority, type, assignedDevs, timeEnd } =
    req.body;

  let ticket;
  let leftOut = [];
  let newMembers = [];
  try {
    ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      const error = new Error('ticket not found');
      error.statusCode = 404;
      return next(error);
    }
    assignedDevs.map((assigned) => {
      ticket.assignedDevs.filter((dev) => {
        if (assigned.toString() !== dev.toString()) {
          if (leftOut.indexOf(dev) === -1) {
            leftOut.push(dev);
          }
        }
      });
    });

    ticket.assignedDevs.map((dev) => {
      assignedDevs.filter((assigned) => {
        if (
          assigned.toString() !== dev.toString() &&
          assigned.toString() !== ticket.creator.toString()
        ) {
          if (newMembers.indexOf(assigned.toString()) === -1) {
            newMembers.push(assigned.toString());
          }
        }
      });
    });
  } catch (err) {
    const error = new Error('editing project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  // deleting ticket from left out members
  try {
    if (leftOut.length > 0) {
      leftOut.map(async (member) => {
        let user = await User.findById(member);
        if (!user) {
          const error = new Error('user not found');
          error.statusCode = 404;
          return next(error);
        }
        user.tickets.pull(ticketId);
        await user.save();
        leftOut = [];
      });
    }
  } catch (err) {
    const error = new Error('editing project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  // adding ticket from new members
  try {
    if (newMembers.length > 0) {
      newMembers.map(async (member) => {
        let user = await User.findById(member);
        if (!user) {
          const error = new Error('user not found');
          error.statusCode = 404;
          return next(error);
        }
        user.tickets.push(ticket._id);
        await user.save();
        newMembers = [];
      });
    }
  } catch (err) {
    const error = new Error('editing project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    ticket.title = title;
    ticket.description = description;
    ticket.status = status;
    ticket.priority = priority;
    ticket.type = type;
    ticket.assignedDevs = assignedDevs;
    ticket.timeEnd = timeEnd;
    await ticket.save();
  } catch (err) {
    const error = new Error('editing project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }
  res
    .status(200)
    .json({ message: 'ticket updated successfully!', ticket: ticket });
};

exports.deleteTicket = async (req, res, next) => {
  const ticketId = req.params.ticketId;

  let ticket;
  try {
    ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      const error = new Error('ticket not found');
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    const error = new Error('deleting ticket failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  let project;
  try {
    project = await Project.findById(ticket.project);
    if (!project) {
      const error = new Error('project not found');
      error.statusCode = 404;
      return next(error);
    }
    await project.tickets.pull(ticketId);
    await project.save();
  } catch (err) {
    const error = new Error('deleting ticket failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  let creator;
  try {
    creator = await User.findById(ticket.creator);
    if (!creator) {
      const error = new Error('user not found');
      error.statusCode = 404;
      return next(error);
    }
    await creator.tickets.pull(ticketId);
    await creator.save();
  } catch (err) {
    const error = new Error('deleting ticket failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    ticket.assignedDevs.map(async (dev) => {
      let devUser = await User.findById(dev);
      if (!devUser) {
        const error = new Error('user not found');
        error.statusCode = 404;
        return next(error);
      }
      await devUser.tickets.pull(ticketId);
      await devUser.save();
    });
  } catch (err) {
    const error = new Error('deleting ticket failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    await Ticket.findByIdAndRemove(ticketId);
  } catch (err) {
    const error = new Error('deleting ticket failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }
  res.status(200).json({ message: 'deleted ticket.' });
};

exports.addComment = async (req, res, next) => {
  const ticketId = req.params.ticketId;
  const { comment } = req.body;
  let user;
  try {
    user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('user not found');
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    const error = new Error('adding comment failed, please try again');
    error.statusCode = 500;
    return next(error);
  }
  const newComment = {
    body: comment,
    creator: user._id,
    createdAt: new Date(),
  };

  let ticket;
  try {
    ticket = await Ticket.findById(ticketId);
    ticket.comments.push(newComment);
    await ticket.save();
  } catch (err) {
    const error = new Error('adding comment failed, please try again');
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json({ message: 'comment sent!' });
};
