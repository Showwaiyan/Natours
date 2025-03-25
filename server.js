const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

// console.log(process.env);

const DB = process.env.DB_REMOTE.replace("<DB_PASSWORD>", process.env.DB_PASSWORD);
mongoose
	// .connect(DB)
	.connect(process.env.DB_LOCAL)
	.then((conn) => {
		console.log("DB is connected");
	});

const port = process.env.PORT || 5500;
app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
