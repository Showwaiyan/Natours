const jwt = require("jsonwebtoken");
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

	if (!email || !password) return next(new AppError("Email and Password are needed to Log In!", 400));
	const user = await User.findOne({ email });

	if (!user || !(await user.comparePassword(password, user.password)))
		return next(new AppError("Email or Password are incorrect!", 401));

	const token = signToken(user._id);
	res.status(201).json({
		status: "success",
		token,
	});
});
