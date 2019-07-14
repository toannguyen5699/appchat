import express from "express";
import authController from "./../controllers/authController";
import homeController from "./../controllers/homeController";
import {authValid} from "./../validation/index";
import passport from "passport";
import initPassportLocal from "./../controllers/passportController/local";
import initPassportFacebook from "./../controllers/passportController/facebook";
import initPassportGoogle from "./../controllers/passportController/google";

// Init all passport
initPassportLocal();
initPassportFacebook();
initPassportGoogle();

let router = express.Router();

/**
 * Init all routes
 * @param app from exactly express module
 */
let initRoutes = (app) => {
	
	router.get("/login-register",authController.checkLoggedOut ,authController.getLoginRegister);
	router.post("/register",authController.checkLoggedOut ,authValid.register, authController.postRegister);
	router.get("/verify/:token",authController.checkLoggedOut ,authController.verifyAccount);
	router.post("/login", passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login-register",
		successFlash: true,
		failureFlash: true

	}));


	router.get("/auth/facebook",authController.checkLoggedOut ,passport.authenticate("facebook", {scope: ["email"]}));
	router.get("/auth/facebook/callback",authController.checkLoggedOut ,passport.authenticate("facebook",{
		successRedirect: "/",
		failureRedirect: "/login-register"
	}));

	router.get("/auth/google",authController.checkLoggedOut ,passport.authenticate("google", {scope: ["email"]}));
	router.get("/auth/google/callback",authController.checkLoggedOut ,passport.authenticate("google",{
		successRedirect: "/",
		failureRedirect: "/login-register"
	}));


	router.get("/",authController.checkLoggedIn  ,homeController.getHome);
	router.get("/logout",authController.checkLoggedIn ,authController.getLogout)
	return app.use("/", router);
};

module.exports = initRoutes;

