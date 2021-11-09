const express = require("express");

const router = express.Router();

const feedController = require("../controllers/feed");

// handling GET /feed/posts
router.get("/posts", feedController.getPosts);

// handling POST /feed/post
router.post("/post", feedController.postPost);

module.exports = router;
