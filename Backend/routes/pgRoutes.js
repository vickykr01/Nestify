const express = require("express");
const router = express.Router();
const PG = require("../models/PG");
const auth = require("../middleware/auth");
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

const normalizeCoordinates = (payload = {}) => {
  const lat = Number.parseFloat(payload.lat ?? payload["coordinates.lat"]);
  const lng = Number.parseFloat(payload.lng ?? payload["coordinates.lng"]);

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng };
  }

  return undefined;
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
      coordinates: normalizeCoordinates(req.body),
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

    const coordinates = normalizeCoordinates(req.body);

    if (coordinates) {
      update.coordinates = coordinates;
    }

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

router.post("/:id/reviews", async (req, res) => {
  try {
    const { name, comment, rating } = req.body;
    const parsedRating = Number.parseInt(rating, 10);

    if (!name || !comment || !Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({
        error: "Name, comment, and a rating from 1 to 5 are required.",
      });
    }

    const pg = await PG.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({ error: "PG not found" });
    }

    pg.reviews.unshift({
      name: String(name).trim(),
      comment: String(comment).trim(),
      rating: parsedRating,
    });

    await pg.save();
    res.json(pg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id/reviews/:reviewId", auth, async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({ error: "PG not found" });
    }

    const review = pg.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    review.deleteOne();
    await pg.save();

    res.json(pg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/verify", auth, async (req, res) => {
  try {
    const updated = await PG.findByIdAndUpdate(
      req.params.id,
      { verifiedByAdmin: Boolean(req.body.verifiedByAdmin) },
      { new: true, runValidators: true },
    );

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
