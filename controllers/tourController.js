const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utilities/apiFeatures");
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// exports.checkID = (req, res, next, val) => {
// 	console.log(`Tour id is: ${val}`);

// 	if (req.params.id * 1 > tours.length) {
// 		return res.status(404).json({
// 			status: "fail",
// 			message: "Invalid ID",
// 		});
// 	}
// 	next();
// };
exports.getTopFiveCheapTours = async (req, res, next) => {
	req.query.sort = "price,-ratingAverage";
	req.query.fields = "name,duration,difficulty,ratingAverage,price,summary";
	req.query.limit = "5";
	next();
};

exports.getAllTours = async (req, res) => {
	try {
		const apiFeatures = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().pagination();

		const tours = await apiFeatures.query;

		res.status(200).json({
			status: "success",
			requestedAt: req.requestTime,
			results: tours.length,
			data: {
				tours,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: "fail",
			message: { error },
		});
	}
};

exports.getTour = async (req, res) => {
	try {
		const tour = await Tour.findById(req.params.id);
		res.status(200).json({
			status: "success",
			data: {
				tour,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: "fail",
			message: { error },
		});
	}
};

exports.createTour = async (req, res) => {
	// console.log(req.body);

	try {
		const newTour = await Tour.create(req.body);
		res.status(201).json({
			status: "success",
			data: {
				tour: newTour,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: "fail",
			message: { error },
		});
	}
};

exports.updateTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		res.status(200).json({
			status: "success",
			data: {
				tour,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: "fail",
			message: { error },
		});
	}
};

exports.deleteTour = async (req, res) => {
	try {
		await Tour.findByIdAndDelete(req.params.id);
		res.status(204);
	} catch (error) {
		res.status(400).json({
			status: "fail",
			message: { error },
		});
	}
};
