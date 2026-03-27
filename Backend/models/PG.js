const mongoose = require("mongoose");

const pgSchema = new mongoose.Schema(
  {
    title: String,
    location: String,
    price: Number,
    images: [String],
    facilities: [String],
    gender: {
      type: String,
      enum: ["boys", "girls", "both"],
    },
    approved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PG", pgSchema);
