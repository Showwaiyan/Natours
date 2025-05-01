const AppError = require("./../utilities/appError");

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};

const handleDuplicateFieldErrorDB = (err) => {
	console.log(err);
	const value = err.errorResponse.errmsg.match(/"([^"]+)"/)[0];
	const message = `Duplicate value ${value}, Please use another value`;
	return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		console.error(`Error💥: ${err}`);
		res.status(500).json({
			status: err.status,
			message: "Something went wrong!",
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "Error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err };

		if (error.kind === "ObjectId") error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldErrorDB(error);

		sendErrorProd(error, res);
	}
};
