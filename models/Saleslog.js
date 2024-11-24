const mongoose = require('mongoose');


const SalesLogSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
      total: Number,
    },
  ],
  totalAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SalesLog', SalesLogSchema);
