const Tour = require("../models/tourModel");
const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/appError");

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slugify: req.params.slug }).populate({
    path: "reviews",
    fields: "review user rating",
  });
  if (!tour) next(new AppError("There is no tour with this name", 404));
  res.status(200).render("tour", {
    title: tour.name,
    tour,
  });
});

exports.getLogin = (req, res) => {
  res.status(200).render("login", {
    title: "Welcome to Natours",
  });
};

exports.getAccount = (req,res)=>{
  res.status(200).render("account", {
    title: "Your Account",
  });
}
