import express from "express";
import authController from "./../controllers/authController";
import homeController from "./../controllers/homeController";
import {authValid} from "./../validation/index";

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
	return app.use("/", router);
};

module.exports = initRoutes;

