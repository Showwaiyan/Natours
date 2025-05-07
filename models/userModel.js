const mongoose = require("mongoose");
const validator = require("validator");

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
			validator: function () {
				return this.passwordConfirm === this.password;
			},
			message: (props) => `${props.value} is not same as Password!`,
		},
	},
});

// Create Model
const User = mongoose.model("User", userSchema);

module.exports = User;
