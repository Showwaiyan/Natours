const mongoose = require("mongoose");
const Tour = require("./tourModel");

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

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.statics.calcAverageAndTotal = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        ratingQuantity: { $count: {} },
        ratingAverage: { $avg: "$rating" },
      },
    },
  ]);
  return stats;
};

reviewSchema.post("save", async function() {
  const stats = await this.constructor.calcAverageAndTotal(this.tour);

  const filter = { _id: this.tour };
  const update = {
    ratingQuantity: stats[0].ratingQuantity,
    ratingAverage: stats[0].ratingAverage,
  };
  await Tour.findOneAndUpdate(filter, update);
});

const Review = mongoose.model("Reviews", reviewSchema);

module.exports = Review;
