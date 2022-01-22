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
    ticket = await Ticket.findById(ticketId).populate({
      path: 'creator project assignedDevs',
      select: 'userName title members',
    });
  } catch (err) {
    const error = new Error('getting ticket detail failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  console.log(ticket);

  try {
    const memberInside = await ticket.project.members.find(
      (member) => member.member._id.toString() === req.userId.toString()
    );

    console.log(memberInside);
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
  try {
    ticket = await Ticket.findById(ticketId);
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
    if (timeEnd > 0) {
      let currentDate = new Date();
      let currentHour = currentDate.getHours();
      let endDate = currentDate.setHours(currentHour + timeEnd);
      ticket.timeEnd = endDate;
    }
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
  } catch (err) {
    const error = new Error('deleting ticket failed, please try again.');
    error.statusCode = 500;
    return next(error);
  }

  if (!ticket) {
    const error = new Error('could not find ticket for provided id');
    error.statusCode = 404;
    return next(error);
  }

  let project;
  try {
    project = await Project.findById(ticket.project);
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
