const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utilities/appError");

const globalErrorHandler = require("./controllers/errorController");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) MIDDLEWARES
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100,
  message: "Too many request from this ip, please try again in a hour",
});

app.use(limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.static(`${__dirname}/public`));

app.use(mongoSanitize());
app.use(xss());

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  }),
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
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
