const mongoose = require("mongoose");

const pgSchema = new mongoose.Schema(
  {
    title: String,
    location: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
    price: Number,
    images: [String],
    facilities: [String],
    verifiedByAdmin: {
      type: Boolean,
      default: false,
    },
    reviews: [
      {
        name: String,
        comment: String,
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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
