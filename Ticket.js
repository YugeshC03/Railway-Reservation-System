const mongoose = require('mongoose');
const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true },
  passengerName: { type: String, required: true },
  seats: { type: Number, required: true },
  journeyDate: { type: Date, required: true },
  trainClass: { type: String, required: true },
  payment: { type: Number, required: true },
  toStation: { type: String, required: true },
  fromStation: { type: String, required: true },
  trainName: { type: String, required: true },
  trainNumber: { type: String, required: true },
  bookingDate: { type: Date, default: Date.now }, 
});
module.exports = mongoose.model('Ticket', ticketSchema);
