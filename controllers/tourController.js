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

exports.checkBody = (req, res, next) => {
	if (!req.body.name || !req.body.price) {
		return res.status(400).json({
			status: "fail",
			message: "Missing name or price",
		});
	}
	next();
};

exports.getAllTours = (req, res) => {
	res.status(200).json({
		status: "success",
		requestedAt: req.requestTime,
		// results: tours.length,
		// data: {
		// 	tours,
		// },
	});
};

exports.getTour = (req, res) => {
	res.status(200).json({
		status: "success",
		// data: {
		// 	tour,
		// },
	});
};

exports.createTour = (req, res) => {
	// console.log(req.body);

	res.status(201).json({
		status: "success",
		// data: {
		// 	tour: newTour,
		// },
	});
};

exports.updateTour = (req, res) => {
	res.status(200).json({
		status: "success",
		data: {
			tour: "<Updated tour here...>",
		},
	});
};

exports.deleteTour = (req, res) => {
	res.status(204).json({
		status: "success",
		data: null,
	});
};
