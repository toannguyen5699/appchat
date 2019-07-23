import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes  from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import session from "./config/session";
import passport from "passport";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import cookieParser from "cookie-parser";
import configSocketIo from "./config/socketio";

//import pem from "pem";
//import https from "https";

/*pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
	if (err) {
	  throw err;
	}
	// initt app
	let app = express();
	// Connect to mongoDB
	connectDB();
	// Config session
	configSession(app);
	// Config view engine
	configViewEngine(app);
	// Enable post data for request
	app.use(bodyParser.urlencoded({ extended: true}));
	// Enable flash messages
	app.use(connectFlash());
	// Config passport js
	app.use(passport.initialize());
	app.use(passport.session());
	// Init all routes
	initRoutes(app);
  
	https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT, function() {
		console.log('Server listening on port' + process.env.APP_PORT);
	});
});*/


// init app
let app = express();

// Init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);

// Connect to mongoDB
connectDB();

// Config session
session.config(app);

// Config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({ extended: true}));

// Enable flash messages
app.use(connectFlash());

// use Cookie Parser
app.use(cookieParser());

// Config passport js
app.use(passport.initialize());
app.use(passport.session());

// Init all routes
initRoutes(app);

// Config for socket.io
configSocketIo(io, cookieParser, session.sessionStore);

// Init all sockets
initSockets(io);

server.listen(process.env.APP_PORT, function() {
	console.log('Server listening on port' + process.env.APP_PORT);
});
