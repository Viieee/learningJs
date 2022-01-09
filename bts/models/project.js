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
      required: true,
    },
    creator: {
      // type: Schema.Types.ObjectId,
      // ref: 'User',
      type: String,
      required: true,
    },
    members: [
      {
        member: {
          type: Object,
          // type: Schema.Types.ObjectId,
          // ref: 'User',
          //   required: true,
        },
        role: {
          type: String,
          //   required: true,
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
      required: true,
    },
  },
  { timestamps: true }
);

// exporting the mongose model
module.exports = mongoose.model('Project', projectSchema);
