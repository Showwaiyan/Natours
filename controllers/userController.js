const AppError = require("../utilities/appError");
const User = require("../models/userModel");
const catchAsync = require("../utilities/catchAsync");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");

// multer config
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img/users/");
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    const fileName = `user-${req.user.id}-${Date.now()}.${extension}`;
    cb(null, fileName);
  },
});

const memoryStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else
    cb(
      new AppError("Only image files are allowed! Please upload again.", 400),
      false,
    );
};

const upload = multer({ storage: memoryStorage, fileFilter });

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const fileName = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`./public/img/users/${fileName}`);

  req.file.filename = fileName;
  next();
});

const filterBody = (obj, ...filters) => {
  const filteredBody = {};
  for (const filter of filters) {
    filteredBody[filter] = obj[filter];
  }
  return filteredBody;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError("You can't update password in here", 401));

  const fliteredBody = filterBody(req.body, "name", "email");
  if (req.file) fliteredBody.photo = req.file.filename;

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
