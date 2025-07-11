const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");
const User = require("./../models/userModel");
const AppError = require("./../utilities/appError");
const catchAsync = require("./../utilities/catchAsync");
const sendEmail = require("./../utilities/email");

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const sendToken = (user, status, res) => {
  const token = signToken(user._id);

  res.status(status).json({
    status: "success",
    token,
    data: {
      user
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  sendToken(newUser, 201, res);
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Email and Password are needed to Log In!", 400));
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password)))
    return next(new AppError("Email or Password are incorrect!", 401));
  
  sendToken(user,201,res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // Check payload token
  if (
    !req.headers.authorization &&
    !req.headers.authorization.startsWith("Bearer")
  )
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // finding user with email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError("There is no user with this email!", 404));

  // create token and encrypt
  const resetToken = user.createResetPasswordToken();
  await user.save();

  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/resetpassword/${resetToken}`;
  const message = `Forgot your email?Submit a patch request with new password and passwordConfirm to\n${resetUrl}\nIf you did not forget you password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 mins)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token send to email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;

    return next(
      new AppError(
        "There was an error sending the mail. Please try again later!",
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetTokenExpire: { $gt: Date.now() },
  });
  if (!user)
    return next(
      new AppError(
        "Token is invalid or expired, request new token again!",
        404,
      ),
    );

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;
  await user.save();

  sendToken(user,201,res)
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  if (req.body.currentPassword === req.body.newPassword)
    return next(
      new AppError(
        "Current password and new password cannot be the same!",
        401,
      ),
    );

  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.comparePassword(req.body.currentPassword, user.password)))
    return next(new AppError("Your current password is incorrect!", 401));

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  sendToken(user,201,res)
});
