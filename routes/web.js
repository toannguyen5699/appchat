import express from "express";
import authController from "./../controllers/authController";
import homeController from "./../controllers/homeController";
import {authValid} from "./../validation/index";
import passport from "passport";
import initPassportLocal from "./../controllers/passportController/local";

// Init all passport
initPassportLocal();

let router = express.Router();

/**
 * Init all routes
 * @param app from exactly express module
 */
let initRoutes = (app) => {
	router.get("/", homeController.getHome);
	router.get("/login-register", authController.getLoginRegister);
	router.post("/register",authValid.register, authController.postRegister);
	router.get("/verify/:token", authController.verifyAccount);
	router.post("/login", passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login-register",
		successFlash: true,
		failureFlash: true

	}));
	return app.use("/", router);
};

module.exports = initRoutes;

