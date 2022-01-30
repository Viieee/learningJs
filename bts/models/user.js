const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
  ],
  tickets: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
  ],
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Notification',
      required: true,
    },
  ],
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  // these fields isn't always required
  verificationToken: String,
  resetToken: String,
  resetTokenExpiration: Date,
});

module.exports = mongoose.model('User', userSchema);
