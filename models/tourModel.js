const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Tour must have name!"],
			unique: true,
			minLength: [10, "Tour name must be more or equal 10 Character!"],
			maxLength: [40, "Tour name must be less or equal 40 Character!"],
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
			default: 0,
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
		priceDiscount: Number,
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
	},
	{
		toJSON: true,
		toObject: true,
	}
);
tourSchema.virtual("durationWeek").get(function () {
	return this.duration / 7;
});

tourSchema.pre("save", function () {
	this.slugify = slugify(this.name, { lower: true });
});

const Tour = mongoose.model("Model", tourSchema);

module.exports = Tour;
