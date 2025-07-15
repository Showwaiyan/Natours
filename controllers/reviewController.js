const Review = require(".././models/reviewModel");
const catchAsync = require(".././utilities/catchAsync");
const ApiFeature = require(".././utilities/apiFeatures");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const apiFeature = new ApiFeature(Review.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const reviews = await apiFeature.query;
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});
