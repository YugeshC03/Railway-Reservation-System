const express = require("express");
const Train = require("../models/Train"); 
const router = express.Router();
const mongoose = require('mongoose'); 
router.post("/add", async (req, res) => {
  const { trainNumber, trainName, fromStation, toStation, journeyDate, availableSeats, fare } = req.body;
  if (!trainNumber || !trainName || !fromStation || !toStation || !journeyDate || !availableSeats || !fare) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const newTrain = new Train({
      trainNumber,
      trainName,
      fromStation,
      toStation,
      journeyDate,
      availableSeats,
      fare,
    });
    await newTrain.save();
    res.status(201).json({ message: "Train added successfully!", train: newTrain });
  } catch (err) {
    console.error("Error adding train:", err);
    res.status(500).json({ error: "Failed to add train. Please try again." });
  }
});
router.get("/", async (req, res) => {
  console.log("GET /api/trains route hit");
  try {
    const trains = await Train.find();
    console.log("Trains fetched:", trains); 
    res.status(200).json(trains);
  } catch (err) {
    console.error("Error fetching trains:", err);
    res.status(500).json({ error: "Failed to fetch trains. Please try again." });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const trainId = req.params.id;
    console.log("Fetching train with ID:", trainId); 
    if (!mongoose.Types.ObjectId.isValid(trainId)) {
      return res.status(400).json({ error: "Invalid train ID format" });
    }
    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({ error: "Train not found" });
    }
    res.status(200).json(train); 
  } catch (err) {
    console.error("Error fetching train by ID:", err);
    res.status(500).json({ error: "Failed to fetch train. Please try again." });
  }
});
module.exports = router;
