import express from "express";
import expressEjsExtend from "express-ejs-extend";

/**
 * Config view engine for app
 */
 let configViewEngine = (app) => {
 	app.use(express.static("./public"));
 	app.engine("ejs", expressEjsExtend);
 	app.set("view engine", "ejs");
 	app.set("views","./views");
 };

 module.exports = configViewEngine;