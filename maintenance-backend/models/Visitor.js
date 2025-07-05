const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  visitorName: { type: String, required: true },
  dateIn: { type: Date, default: Date.now },
  dateOut: { type: Date },
  timeIn: { type: String },
  timeOut: { type: String },
  blockNumber: { type: String, required: true },  // ✅ This is what will be displayed in admin view
  residentUsername: { type: String }              // Optional: helps to trace who submitted
});

module.exports = mongoose.model('Visitor', visitorSchema);
