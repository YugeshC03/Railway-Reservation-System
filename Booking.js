const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  trainClass: { type: String, required: true },
  bookingDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Booking', bookingSchema);
