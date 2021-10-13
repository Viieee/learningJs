const path = require("path");

const rootDir = require("../util/path");

const express = require("express");

// importing router
// ! router is used to handle the routing in express
const router = express.Router();

// handling get request to /
router.get("/", (req, res, next) => {
  // sending response
  res.sendFile(path.join(rootDir, "views", "shop.html"));

  /* 
    ? __dirname hold the absolute path of this file's folder
    ? this way it can work on both linux and windows systems
    ? ../ will go up one folder
    ! rootDir replaces __dirname, '../'
  */
});

module.exports = router;
