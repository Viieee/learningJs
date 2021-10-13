const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

// get request to /login
router.get("/login", authController.getLogin);

// post request to /login
router.post("/login", authController.postLogin);

// get request to /signup
router.get("/signup", authController.getSignup);

// post request to /signup
router.post("/signup", authController.postSignup);

// post request to /logout
router.post("/logout", authController.postLogout);

// get request to /reset
router.get("/reset", authController.getReset);

// post request to /reset
router.post("/reset", authController.postReset);

// get request to /reset/:token
router.get("/new-password/:token", authController.getNewPassword);

// post request to /new-password
router.post("/new-password", authController.postNewPassword);

module.exports = router;
