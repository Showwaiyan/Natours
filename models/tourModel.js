const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Tour must have name!"],
			unique: true,
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
		},
		ratingAverage: {
			type: Number,
			default: 0,
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
