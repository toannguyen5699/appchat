import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes  from "./routes/web";
import bodyParser from "body-parser";

// initt app
let app = express();

// Connect to mongoDB
connectDB();

// Config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({ extended: true}));

// Init all routes
initRoutes(app);

app.listen(process.env.APP_PORT, function() {
	console.log('Server listening on port' + process.env.APP_PORT);
});