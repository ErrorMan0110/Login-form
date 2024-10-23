const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routers/authRouter");

const PORT = process.env.PORT || 5000;
const DB =
	"mongodb+srv://dimapuzh49:e7rU7g6gaFrcQuch@cluster0.2buttnp.mongodb.net/";
const app = express();

app.use(express.json());
app.use("/auth", authRouter);
app.use(express.static("styles"));

mongoose
	.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("Connected to mongo db");
	})
	.catch((error) => {
		console.log(error);
	});

app.listen(PORT, "localhost", (error) => {
	error ? console.log(error) : console.log(`Listening port ${PORT}`);
});
