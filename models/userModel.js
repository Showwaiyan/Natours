const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// Create Schema
const userSchema = mongoose.Schema({
	name: {
		type: String,
		require: [true, "Name cannot be empty"],
	},
	email: {
		type: String,
		require: [true, "Email cannot be empty"],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, "Email address is not valid"],
	},
	photo: String,
	password: {
		type: String,
		require: [true, "Password cannot be empty"],
		minLength: [8, "Passwrod should be long at least 8"],
	},
	passwordConfirm: {
		type: String,
		require: [true, "Confirm Password cannot be empty"],
		validate: {
			validator: function (value) {
				return value === this.password;
			},
			message: (props) => `${props.value} is not same as Password!`,
		},
	},
});

// Password Encrypting
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 12);

	this.passwordConfirm = undefined;
	next();
});

// Create Model
const User = mongoose.model("User", userSchema);

module.exports = User;
