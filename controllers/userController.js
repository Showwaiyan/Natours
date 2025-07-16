const AppError = require("../utilities/appError");
const User = require("../models/userModel");
const catchAsync = require("../utilities/catchAsync");
const factory = require("./handlerFactory");

const filterBody = (obj, ...filters) => {
  const filteredBody = {};
  for (const filter of filters) {
    filteredBody[filter] = obj[filter];
  }
  return filteredBody;
};

exports.getMe = (req,res,next) => {
  req.params.id = req.user.id;
  next()
}

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError("You can't update password in here", 401));

  const fliteredBody = filterBody(req.body, "name", "email");
  console.log(fliteredBody);

  const user = await User.findByIdAndUpdate(req.user.id, fliteredBody, {
    returnDocument: "after",
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    status: "success",
    message: "Information are updated",
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
