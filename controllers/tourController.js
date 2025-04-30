const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utilities/apiFeatures");
const catchAsync = require("./../utilities/catchAsync");
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
exports.getTopFiveCheapTours = catchAsync(async (req, res, next) => {
	req.query.sort = "price,-ratingAverage";
	req.query.fields = "name,duration,difficulty,ratingAverage,price,summary";
	req.query.limit = "5";
	next();
});

exports.getAllTours = catchAsync(async (req, res, next) => {
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
});

exports.getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findById(req.params.id);
	res.status(200).json({
		status: "success",
		data: {
			tour,
		},
	});
});

exports.createTour = catchAsync(async (req, res, next) => {
	// console.log(req.body);

	const newTour = await Tour.create(req.body);
	res.status(201).json({
		status: "success",
		data: {
			tour: newTour,
		},
	});
});

exports.updateTour = catchAsync(async (req, res, next) => {
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
});

exports.deleteTour = catchAsync(async (req, res, next) => {
	await Tour.findByIdAndDelete(req.params.id);
	res.status(204);
});

exports.getToursStats = catchAsync(async (req, res, next) => {
	const stats = await Tour.aggregate([
		{
			$match: { ratingAverage: { $lte: 4.5 } },
		},
		{
			$group: {
				_id: { $toUpper: "$difficulty" },
				numTours: { $sum: 1 },
				numRating: { $sum: "$ratingQuantity" },
				avgRating: { $avg: "$ratingAverage" },
				avgPrice: { $avg: "$price" },
				minPrice: { $min: "$price" },
				maxPrice: { $max: "$price" },
			},
		},
		{
			$sort: { avgPrice: 1 },
		},
	]);

	res.status(200).json({
		status: "success",
		data: {
			stats,
		},
	});
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
	const year = req.params.year;
	const plan = await Tour.aggregate([
		{
			$unwind: "$startDates",
		},
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},
		{
			$group: {
				_id: {
					$month: "$startDates",
				},
				numTours: { $sum: 1 },
				tours: { $push: "$name" },
			},
		},
		{
			$addFields: {
				month: "$_id",
			},
		},
		{
			$project: {
				_id: 0,
			},
		},
		{
			$sort: { numTours: -1 },
		},
	]);

	res.status(200).json({
		status: "success",
		data: {
			plan,
		},
	});
});
