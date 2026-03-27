const express = require("express");
const router = express.Router();
const PG = require("../models/PG");
const upload = require("../middleware/upload");

// ✅ GET all PGs
router.get("/", async (req, res) => {
  const pgs = await PG.find();
  res.json(pgs);
});

// CREATE PG with image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file.path;

    const newPG = new PG({
      ...req.body,
      images: [imageUrl],
      facilities: req.body.facilities.split(","),
    });

    await newPG.save();
    res.json(newPG);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE PG
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updated = await PG.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE PG
router.delete("/:id", async (req, res) => {
  try {
    await PG.findByIdAndDelete(req.params.id);
    res.json({ message: "PG Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
