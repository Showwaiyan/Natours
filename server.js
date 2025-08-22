const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");
const mongoose = require("mongoose");


// console.log(process.env);
process.on("unhandledRejection", (err) => {
	console.log(err.name);
	console.log(err.message);

	server.close(() => {
		process.exit(1);
	});
});

process.on("uncaughtException", (err) => {
	console.log(err.name);
	console.log(err.message);

	process.exit(1);
});

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

const port = process.env.PORT || 5500;
const server = app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
