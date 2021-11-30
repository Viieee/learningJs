const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  assignedMember: 'Vie',
});

// exporting the schema
module.exports = mongoose.model('Ticket', ticketSchema);