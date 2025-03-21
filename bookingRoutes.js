const express = require('express');
const Ticket = require('../models/Ticket'); 
const Train = require('../models/Train'); 
const Booking = require('../models/Booking'); 
const router = express.Router();
const mongoose = require('mongoose');
router.get('/history/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;
      const bookings = await Booking.find({ userId });

      if (!bookings.length) {
          return res.status(404).json({ message: "No bookings found" });
      }
      res.json(bookings);
  } catch (error) {
      console.error("Error fetching booking history:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post('/book', async (req, res) => {
    try {
        const { userId, trainId, passengerName, seats, journeyDate, trainClass, payment } = req.body;
        if (!userId || !trainId || !passengerName || !seats || !journeyDate || !trainClass || !payment) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!mongoose.Types.ObjectId.isValid(trainId)) {
            return res.status(400).json({ error: "Invalid trainId format" });
        }
        const train = await Train.findById(trainId);
        if (!train) {
            return res.status(404).json({ error: "Train not found" });
        }
        if (train.availableSeats < seats) {
            return res.status(400).json({ error: "Not enough seats available" });
        }
        const ticket = new Ticket({
            userId,
            trainId,
            passengerName,
            seats,
            journeyDate,
            trainClass,
            payment,
            fromStation: train.fromStation,
            toStation: train.toStation,
            trainName: train.trainName,
            trainNumber: train.trainNumber
        });
        await ticket.save();
        train.availableSeats -= seats;
        await train.save();
        const booking = new Booking({
            userId,
            ticketId: ticket._id,
            trainClass
        });
        await booking.save();
        res.json({ message: "Booking successful", booking });
    } catch (error) {
        console.error("Error booking ticket:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = router;
