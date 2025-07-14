const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tour must have name!"],
      unique: true,
      minLength: [10, "Tour name must be more or equal 10 Character!"],
      maxLength: [40, "Tour name must be more or equal 10 Character!"],
    },
    slugify: String,
    duration: {
      type: Number,
      required: [true, "Tour must have Duration!"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "Tour must have Maximum Group Size!"],
    },
    difficulty: {
      type: String,
      required: [true, "Tour must have difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must be either easy, medium or difficult",
      },
    },
    ratingAverage: {
      type: Number,
      default: 1,
      min: [1, "Rating must be more or equal 1.0"],
      max: [5, "Rating must be more or equal 5.0"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Each tour is need pricing"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(value) {
          return value < this.price;
        },
        message: "Discount price {VALUE} must be lower than regular price1",
      },
    },
    summary: {
      type: String,
      required: [true, "Tour must have summary!"],
    },
    description: {
      type: String,
      required: [true, "Tour must have description!"],
    },
    imageCover: {
      type: String,
      required: [true, "Tour must have Image Cover"],
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
tourSchema.virtual("durationWeek").get(function() {
  return this.duration / 7;
});

tourSchema.pre("save", function() {
  this.slugify = slugify(this.name, { lower: true });
});
tourSchema.pre(/^find/, function() {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangeAt"
  })
})

const Tour = mongoose.model("Tours", tourSchema);

module.exports = Tour;
