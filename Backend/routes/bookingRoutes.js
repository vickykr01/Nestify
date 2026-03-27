const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");

router.post("/", async (req, res) => {
  try {
    const booking = new Booking({
      name: req.body.name,
      phone: req.body.phone,
      message: req.body.message,
      pg: req.body.pg,
    });

    await booking.save();
    res.json({ message: "Request Sent Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("pg");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
