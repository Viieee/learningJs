const express = require("express");
const expressValidator = require("express-validator");

const router = express.Router();

const feedController = require("../controllers/feed");

const tokenValidation = require("../middleware/isAuth");

// handling GET /feed/posts
router.get("/posts", tokenValidation, feedController.getPosts);

// handling POST /feed/post
router.post(
  "/post",
  tokenValidation,
  [
    expressValidator.body("title").trim().isLength({ min: 5 }),
    expressValidator.body("content").trim().isLength({ min: 5 }),
  ],
  feedController.postPost
);

// handling single post GET /feed/post/:postId
router.get("/post/:postId", tokenValidation, feedController.getAPost);

// handling editing post PUT /feed/post/:postId
router.put(
  "/post/:postId",
  tokenValidation,
  [
    expressValidator.body("title").trim().isLength({ min: 5 }),
    expressValidator.body("content").trim().isLength({ min: 5 }),
  ],
  feedController.editPost
);

// handling deleting post DELETE /feed/post/:postId
router.delete("/post/:postId", tokenValidation, feedController.deletePost);

module.exports = router;
