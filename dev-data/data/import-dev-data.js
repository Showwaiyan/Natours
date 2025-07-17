const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Tour = require("./../../models/tourModel");
const User = require("./../../models/userModel");
const Review = require("./../../models/reviewModel");

dotenv.config({ path: "./config.env" });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));

const DB = process.env.DB_REMOTE.replace("<DB_PASSWORD>", process.env.DB_PASSWORD);
const DB_OPTION = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	retryWrites: true,
};
mongoose
	// .connect(DB,DB_OPTION)
	.connect(process.env.DB_LOCAL)
	.then((conn) => {
		console.log("DB is connected");
	});

const importDocuments = async () => {
	try {
		await Tour.create(tours);
		await User.create(users, {validateBeforeSave: false});
		await Review.create(reviews);
		console.log("Documents are successfully imported");
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

const deleteDocuments = async () => {
	try {
		await Tour.deleteMany();
		await User.deleteMany();
		await Review.deleteMany();
		console.log("Documents are successfully deleted");
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

switch (process.argv[2]) {
	case "--import":
		importDocuments();
		break;
	case "--delete":
		deleteDocuments();
		break;
	default:
		console.log("Script finished");
		break;
}
console.log(process.argv);
