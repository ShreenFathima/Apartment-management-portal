const mongoose = require("mongoose");

const rentSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // link to the user collection
    required: true
  },
  residentName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  block: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["Paid", "Due"],
    default: "Due"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Rent", rentSchema);
