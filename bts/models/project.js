const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        _id: false,
        member: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          required: true,
        },
      },
    ],
    tickets: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
      },
    ],
    apiKey: {
      type: String,
      default: null,
    },
    apiPrefix: String,
  },
  { timestamps: true }
);

// exporting the mongose model
module.exports = mongoose.model('Project', projectSchema);
