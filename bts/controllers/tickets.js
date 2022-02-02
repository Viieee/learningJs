const Ticket = require('../models/ticket');
const User = require('../models/user');
const Project = require('../models/project');
const Comment = require('../models/comment');
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
        path: 'creator project assignedDevs',
        select: 'userName title members',
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'creator',
          select: 'userName',
        },
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
  let project;
  let leftOut;
  let newMember;
  try {
    ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      const error = new Error('ticket not found');
      error.statusCode = 404;
      return next(error);
    }
    project = await Project.findById(ticket.project);
    if (!project) {
      const error = new Error('project not found');
      error.statusCode = 404;
      return next(error);
    }
    // var array1 = ['cat', 'sum', 'fun', 'run'];
    // var array2 = ['bat', 'cat', 'dog', 'sun', 'hut', 'gut'];
    // const intersection = array1.filter((element) => array2.includes(element));
    // console.log(intersection);

    let checkInputData = project.members.filter((member) =>
      assignedDevs.includes(member.member.toString())
    );
    let checkCurrentAssigned = project.members.filter((member) =>
      ticket.assignedDevs.includes(member.member)
    );
    leftOut = checkCurrentAssigned.filter(
      (member) => !checkInputData.includes(member)
    );
    newMember = checkInputData.filter((member) => {
      if (
        !checkCurrentAssigned.includes(member) &&
        member.member.toString() !== ticket.creator.toString()
      ) {
        return member;
      }
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
        let user = await User.findById(member.member);
        if (!user) {
          const error = new Error('user not found');
          error.statusCode = 404;
          return next(error);
        }
        user.tickets.pull(ticketId);
        await user.save();
      });
    }
  } catch (err) {
    const error = new Error('editing project failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  // adding ticket to new members
  try {
    if (newMember.length > 0) {
      newMember.map(async (member) => {
        let newUser = await User.findById(member.member);
        if (!newUser) {
          const error = new Error('user not found');
          error.statusCode = 404;
          return next(error);
        }
        newUser.tickets.push(ticketId);
        await newUser.save();
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
  res.status(200).json({ message: 'deleted ticket.', ticket: ticketId });
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
  const newComment = new Comment({
    body: comment,
    creator: user._id,
    ticket: ticketId,
  });

  try {
    await newComment.save();
  } catch (err) {
    const error = new Error('adding comment failed, please try again');
    error.statusCode = 500;
    return next(error);
  }

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

  let socketData;
  try {
    socketData = await Comment.findById(newComment._id).populate({
      path: 'creator',
      select: 'userName',
    });
  } catch (err) {
    const error = new Error('adding comment failed, please try again');
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json({
    message: 'comment sent!',
    comment: socketData,
  });
};

exports.deleteComment = async (req, res, next) => {
  const { commentId, ticketId } = req.params;

  let ticket;
  let comment;
  try {
    ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      const error = new Error('ticket not found');
      error.statusCode = 404;
      return next(error);
    }
    comment = await Comment.findById(commentId);
    if (!comment) {
      const error = new Error('comment not found');
      error.statusCode = 404;
      return next(error);
    }
    if (comment.creator.toString() !== req.userId.toString()) {
      const error = new Error('unauthorized.');
      error.statusCode = 401;
      return next(error);
    }
  } catch (err) {
    const error = new Error('adding comment failed, please try again');
    error.statusCode = 500;
    return next(error);
  }

  try {
    ticket.comments.pull(comment);
    await ticket.save();
  } catch (err) {
    const error = new Error('adding comment failed, please try again');
    error.statusCode = 500;
    return next(error);
  }

  try {
    await Comment.findByIdAndDelete(commentId);
  } catch (err) {
    const error = new Error('adding comment failed, please try again');
    error.statusCode = 500;
    return next(error);
  }

  res.status(200).json({ message: 'comment deleted!', comment: commentId });
};
