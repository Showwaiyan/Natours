const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty"],
    },
    rating: {
      type: Number,
      required: [true, "Rating cannot be empty"],
      min: [1, "Rating cannot be zero or negative"],
      max: [5, "Rating must be less than 5"],
      default: 1,
    },
    craeteAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tours",
      require: [true, "Review must belong to tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: [true, "Review must belong to user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Review = mongoose.model("Reviews", reviewSchema);

module.exports = Review;
