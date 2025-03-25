const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

// console.log(process.env);

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

const tourSchema = new mongoose.Schema({
	title: {
		type: String,
		require: [true, "Tour must have name!"],
	},
	rating: {
		type: Number,
		default: 2.5,
	},
	price: {
		type: Number,
		require: [true, "Each tour is need pricing"],
	},
});

const Tour = mongoose.model("Model", tourSchema);

const port = process.env.PORT || 5500;
app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
