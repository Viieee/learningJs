const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
    },
    customLink: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
