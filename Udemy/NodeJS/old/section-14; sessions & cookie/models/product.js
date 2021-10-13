// importing mongoose
const mongoose = require('mongoose');

// importing mongoose schema
const Schema = mongoose.Schema;

// making new schema
const productSchema = new Schema({
  // fields and the configuration of each fields
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId, // telling the type is objectId
    required: true,
    ref: 'User' 
  }
});

// exporting the schema
module.exports = mongoose.model('Product', productSchema);