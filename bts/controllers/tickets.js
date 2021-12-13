const Ticket = require('../models/ticket');

exports.getTickets = (req, res, next) => {
  res.status(200).json([
    {
      id: 'e1',
      title: 'ticket name dummy number 1',
    },
  ]);
};

exports.postTicket = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const ticket = new Ticket({
    title: title,
    description: description,
    assignedMember: 'Vie'
  });
  ticket
    .save()
    .then((result) => {
      res
        .status(201)
        .json({ message: 'ticket created successfully', ticket: ticket });
    })
    .catch((err) => {
      console.log(err);
    });
};
