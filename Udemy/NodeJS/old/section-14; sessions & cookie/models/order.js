// importing mongoose
const mongoose = require('mongoose');

// importing mongoose schema
const Schema = mongoose.Schema;

// making new schema
const orderSchema = new Schema({
  // fields and the configuration of each fields
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  user: {
    name: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId, // telling the type is objectId
      required: true,
      ref: 'User' // telling mongoose that we are referencing to other collection
                  // this will enable us to be able to access the full detailed data
                  // of the referenced data from different field and not just the id
    }
  }
});

// exporting the schema
module.exports = mongoose.model('Order', orderSchema);
