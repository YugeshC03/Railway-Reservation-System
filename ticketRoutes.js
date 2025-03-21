const express = require("express");
const mongoose = require("mongoose");
const Ticket = require("../models/Ticket");
const Train = require("../models/Train");
const Booking = require("../models/Booking");
const router = express.Router();
router.get("/latest/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID format" });
    }
    console.log("Fetching latest ticket for user:", userId);
    const latestTicket = await Ticket.findOne({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ _id: -1 });
    if (!latestTicket) {
      console.log("No ticket found for user:", userId);
      return res.status(404).json({ error: "No ticket found for this user." });
    }
    res.json(latestTicket);
  } catch (error) {
    console.error("Error fetching latest ticket:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/book", async (req, res) => {
  const { userId, trainId, passengerName, seats, journeyDate, trainClass, payment } = req.body;
  if (!userId || !trainId || !passengerName || !seats || !journeyDate || !trainClass || !payment) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    console.log("Fetching train details for booking...");
    const train = await Train.findById(trainId);
    if (!train) {
      console.error("Train not found for ID:", trainId);
      return res.status(404).json({ error: "Train not found." });
    }
    console.log("Train found:", train);
    if (train.availableSeats < seats) {
      console.error("Not enough seats available. Requested:", seats, "Available:", train.availableSeats);
      return res.status(400).json({ error: "Not enough seats available." });
    }
    console.log("Creating a new ticket...");
    const ticket = new Ticket({
      userId,
      trainId,
      passengerName,
      seats,
      journeyDate,
      trainClass,
      payment,
      toStation: train.toStation, 
      fromStation: train.fromStation, 
      trainName: train.trainName, 
      trainNumber: train.trainNumber, 
    });
    await ticket.save();
    console.log("Ticket created successfully:", ticket);
    const booking = new Booking({
      userId,
      ticketId: ticket._id,
    });
    await booking.save();
    console.log("Booking created successfully:", booking);
    train.availableSeats -= seats;
    await train.save();
    console.log("Updated train available seats:", train.availableSeats);
    res.status(201).json({ message: "Booking successful", ticket, booking });
  } catch (err) {
    console.error("Error booking ticket:", err);
    res.status(500).json({ error: "Failed to book ticket. Please try again." });
  }
});
router.delete("/cancel/:ticketId", async (req, res) => {
  try {
      const ticketId = req.params.ticketId;
      if (!mongoose.Types.ObjectId.isValid(ticketId)) {
          return res.status(400).json({ error: "Invalid Ticket ID format" });
      }
      console.log("Canceling ticket with ID:", ticketId);
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
          console.error("Ticket not found for ID:", ticketId);
          return res.status(404).json({ error: "Ticket not found." });
      }
      const train = await Train.findById(ticket.trainId);
      if (!train) {
          console.error("Train not found for ID:", ticket.trainId);
          return res.status(404).json({ error: "Train not found." });
      }
      train.availableSeats += ticket.seats;
      await train.save();
      console.log("Updated train available seats:", train.availableSeats);
      await Ticket.deleteOne({ _id: ticketId });
      console.log("Ticket canceled successfully:", ticketId);
      res.json({ message: "Ticket canceled successfully." });
  } catch (error) {
      console.error("Error canceling ticket:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
