const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

const validator = require("../middleware/validation");

const expressValidator = require("express-validator");

// get request to /login
router.get("/login", authController.getLogin);

// post request to /login
// direct validation
router.post(
  "/login",
  [
    expressValidator
      .body("email")
      .isEmail()
      .withMessage("Please enter a valid email"),
    expressValidator
      .body("password")
      .isLength({ min: 5 })
      .withMessage("Please enter a password with at least 5 characters"),
  ],
  authController.postLogin
);

// get request to /signup
router.get("/signup", authController.getSignup);

// post request to /signup
// validation using other file (../middleware/validation.js)
router.post("/signup", validator, authController.postSignup);

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
