const Tour = require("../models/tourModel");
const catchAsync = require("../utilities/catchAsync");

exports.getHome = (req, res) => {
  res.status(200).render("base", {
    title: "Welcome",
  });
};

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slugify: req.params.slug }).populate({
    path: "reviews",
    fields: "review user rating",
  });
  res.status(200).render("tour", {
    title: tour.name,
    tour
  });
});
