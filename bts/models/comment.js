const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const commentSchema = new Schema(
  {
    body: {
      type: String,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  { timestamps: true }
);

// exporting the schema
module.exports = mongoose.model('Comment', commentSchema);
