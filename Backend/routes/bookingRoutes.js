const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");

// CREATE booking request
router.post("/", auth, async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json({ message: "Request Sent Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all bookings (for admin later)
router.get("/", auth, async (req, res) => {
  const bookings = await Booking.find().populate("pg");
  res.json(bookings);
});

// UPDATE booking status
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
