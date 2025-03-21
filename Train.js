const mongoose = require('mongoose');
const trainSchema = new mongoose.Schema({
  trainNumber: { type: String, required: true },
  trainName: { type: String, required: true },
  fromStation: { type: String, required: true },
  toStation: { type: String, required: true },
  journeyDate: { type: Date, required: true },
  availableSeats: { type: Number, required: true },
  fare: { type: Number, required: true },
});
module.exports = mongoose.model('Train', trainSchema);
