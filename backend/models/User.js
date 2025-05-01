// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   username: { type: String, required: true, unique: true }, // Ensure username is defined and unique
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);



import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  userCode: { type: String, required: true, unique: true },
  businessId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Business',
    unique: true,
    sparse: true 
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
