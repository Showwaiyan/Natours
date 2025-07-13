const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Tour = require("./../../models/tourModel");
const { dirname } = require("path");

dotenv.config({ path: "./config.env" });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));

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

const importTours = async () => {
	try {
		await Tour.create(tours);
		console.log("Tours are successfully imported");
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

const deleteTours = async () => {
	try {
		await Tour.deleteMany();
		console.log("Tours are successfully deleted");
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

switch (process.argv[2]) {
	case "--import":
		importTours();
		break;
	case "--delete":
		deleteTours();
		break;
	default:
		console.log("Script finished");
		break;
}
console.log(process.argv);
