const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("./../models/userModel");
const AppError = require("./../utilities/appError");
const catchAsync = require("./../utilities/catchAsync");

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Email and Password are needed to Log In!", 400));
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password)))
    return next(new AppError("Email or Password are incorrect!", 401));

  const token = signToken(user._id);
  res.status(201).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // Check payload token
  if (!req.headers.authorization && !req.headers.authorization.startsWith("Bearer"))
    return next(new AppError("Please log in!", 401));
  const token = req.headers.authorization.split(" ")[1];

  // Check token valid
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check user exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError("User belonging to this token does not exist!", 401),
    );

  // Check user change password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError("User changed password recently, please log in again!"),
    );

  // Granted Access
  req.user = currentUser;
  next();
});

exports.restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You have no permission to perform this action", 403),
      );
    next();
  };
};
