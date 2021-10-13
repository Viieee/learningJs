const express = require("express");

// importing router
// ! router is used to handle the routing in express
const router = express.Router();

// handling get request to /
router.get("/", (req, res, next) => {
    // sending response
    res.send("<h1>Hello from express</h1>");
});

module.exports = router;