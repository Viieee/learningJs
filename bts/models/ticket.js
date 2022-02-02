const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    assignedDevs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
      },
    ],
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timeEnd: {
      type: Date,
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true }
);

// exporting the schema
module.exports = mongoose.model('Ticket', ticketSchema);
