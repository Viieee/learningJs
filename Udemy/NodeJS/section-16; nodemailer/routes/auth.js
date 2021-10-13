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

module.exports = router;
