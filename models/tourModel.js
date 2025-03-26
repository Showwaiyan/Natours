const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "Tour must have name!"],
		unique: true,
	},
	rating: {
		type: Number,
		default: 2.5,
	},
	price: {
		type: Number,
		required: [true, "Each tour is need pricing"],
	},
});

const Tour = mongoose.model("Model", tourSchema);

module.exports = Tour;
