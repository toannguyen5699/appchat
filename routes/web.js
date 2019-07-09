import express from "express";
import authController from "./../controllers/authController";
import homeController from "./../controllers/homeController";

let router = express.Router();

/**
 * Init all routes
 * @param app from exactly express module
 */
let initRoutes = (app) => {
	router.get("/", homeController.getHome);
	router.get("/login-register", authController.getLoginRegister);
	router.post("/register", authController.postRegister);
	return app.use("/", router);
};

module.exports = initRoutes;

