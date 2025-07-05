const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['admin', 'resident'],
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true // ensure full name is not duplicated
  },
  password: {
    type: String,
    required: true
  },
  email: String,
  phone: String,
  age: Number,
  block: String,

  // Only for residents
  numPersons: Number,
  memberNames: [String],

  // Only for admins
  address: String,
  city: String,
  state: String,
  pincode: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
