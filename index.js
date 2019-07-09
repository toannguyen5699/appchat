import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes  from "./routes/web";
// initt app
let app = express();

// Connect to mongoDB
connectDB();

// Config view engine
configViewEngine(app);

// Init all routes
initRoutes(app);

app.listen(process.env.APP_PORT, function() {
	console.log('Server listening on port' + process.env.APP_PORT);
});