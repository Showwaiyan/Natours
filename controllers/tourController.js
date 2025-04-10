const Tour = require("./../models/tourModel");
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
		// Execulde non-query field
		let queryObj = { ...req.query };
		execludeField = ["page", "limit", "sort", "fields"];
		execludeField.forEach((element) => delete queryObj[element]);

		// Filtering
		queryObj = JSON.parse(JSON.stringify(queryObj).replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`));

		let query = Tour.find(queryObj);

		// Sorting
		if (req.query.sort) {
			const sortBy = req.query.sort.split(",").join(" ");
			query = query.sort(sortBy);
		} else {
			query = query.sort("-createAt");
		}

		// Field limiting
		if (req.query.fields) {
			const fields = req.query.fields.split(",").join(" ");
			query = query.select(fields);
		} else {
			query = query.select("-__v");
		}

		// Pagination
		const page = req.query.page * 1 || 1;
		const limit = req.query.limit * 1 || 10;

		const skip = (page - 1) * limit;

		const totalPage = await Tour.countDocuments();

		if (skip >= totalPage) throw new Error("The page is not exist!");

		query = query.skip(skip).limit(limit);

		const tours = await query;

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
