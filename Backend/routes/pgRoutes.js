const express = require("express");
const router = express.Router();
const PG = require("../models/PG");
const upload = require("../middleware/upload");

const normalizeFacilities = (facilities = []) => {
  if (Array.isArray(facilities)) {
    return facilities.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof facilities === "string") {
    return facilities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

router.get("/", async (req, res) => {
  try {
    const pgs = await PG.find();
    res.json(pgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({ error: "PG not found" });
    }

    res.json(pg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const newPG = new PG({
      ...req.body,
      images: req.file?.path ? [req.file.path] : [],
      facilities: normalizeFacilities(req.body.facilities),
    });

    await newPG.save();
    res.json(newPG);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const update = {
      ...req.body,
      facilities: normalizeFacilities(req.body.facilities),
    };

    if (req.file?.path) {
      update.images = [req.file.path];
    }

    const updated = await PG.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "PG not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await PG.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "PG not found" });
    }

    res.json({ message: "PG Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
