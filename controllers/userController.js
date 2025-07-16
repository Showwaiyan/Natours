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

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
