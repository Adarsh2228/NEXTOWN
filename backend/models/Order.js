// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   products: [{ name: String, quantity: Number, price: Number }],
//   totalAmount: Number,
//   status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'] },
// });

// const Order = mongoose.model('Order', orderSchema);
// module.exports = Order;

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{ name: String, quantity: Number, price: Number }],
  totalAmount: Number,
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'] },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;


