const catchAsync = require("./../utilities/catchAsync");
const AppError = require("./../utilities/appError");

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc)
      return next(new AppError("Can't find a document with this ID", 404));
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
};
