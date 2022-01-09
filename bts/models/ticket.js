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
      required: true,
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
    // assignedDevs: [
    //   {
    //     member: {
    // type: Schema.Types.ObjectId,
    // ref: 'User',
    //   required: true,
    //     },
    //   },
    // ],
    // creator: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
    timeEnd: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// exporting the schema
module.exports = mongoose.model('Ticket', ticketSchema);
