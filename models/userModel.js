const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    require: [true, "Password cannot be empty"],
    minLength: [8, "Passwrod should be long at least 8"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, "Confirm Password cannot be empty"],
    validate: {
      validator: function(value) {
        return value === this.password;
      },
      message: (props) => `${props.value} is not same as Password!`,
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpire: Date,
});

// Password Encrypting
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  if (this.isNew) return next();
  this.passwordChangeAt = Date.now() - 1000;
  next();
});

// Instance Method for password comparing
userSchema.methods.comparePassword = async function(
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function(JwtTimeStamp) {
  console.log(this);
  if (this.passwordChangeAt) {
    const passwordChangeTimeStamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10,
    );
    console.log(passwordChangeTimeStamp, JwtTimeStamp);
    return JwtTimeStamp < passwordChangeTimeStamp;
  }
  return false;
};
userSchema.methods.createResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
userSchema.methods.compareResetPasswordToken = function(
  candidateToken,
  userToken,
) {
  const tokenToHash = crypto
    .createHash("sha256")
    .update(candidateToken)
    .digest("hex");
  console.log(candidateToken, userToken);
  return tokenToHash === userToken;
};

// Create Model
const User = mongoose.model("User", userSchema);

module.exports = User;
