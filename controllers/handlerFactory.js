const catchAsync = require("./../utilities/catchAsync");
const AppError = require("./../utilities/appError");
const APIFeatures = require("./../utilities/apiFeatures");

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, populateOption) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOption) query = query.populate(populateOption);
    const doc = await query;
    if (!doc)
      return next(new AppError("Can't find a document with this ID", 404));

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // Only for review
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    let query;
    if (filter) query = Model.find(filter);
    query = Model.find();

    const apiFeatures = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    const docs = await apiFeatures.query;

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc)
      return next(new AppError("Can't find a document with this ID", 404));
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc)
      return next(new AppError("Can't find a document with this ID", 404));

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
