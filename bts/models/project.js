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
      required: true,
    },
  },
  { timestamps: true }
);

// projectSchema.methods.deleteMember = function (id) {
//   // delete project's member using id
//   const updatedProjectMember = this.members.filter((member) => {
//     return member.member.toString() !== id.toString();
//   });

//   // rewritting the value of the members
//   this.members = updatedProjectMember;

//   // saving the change
//   return this.save();
// };

// exporting the mongose model
module.exports = mongoose.model('Project', projectSchema);
