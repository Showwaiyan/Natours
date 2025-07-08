const express = require("express");
const morgan = require("morgan");

const AppError = require("./utilities/appError");

const globalErrorHandler = require("./controllers/errorController");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
  console.log(req.headers)
	next();
});

// 3) ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Handle Unhandle Route
app.all("*", (req, res, next) => {
	// const err = new Error(`Can't find ${req.originalUrl} on the server!`);
	// err.statusCode = 404;
	// err.status = "Fail";

	next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

// Express Error Handle Middle
app.use(globalErrorHandler);

module.exports = app;
