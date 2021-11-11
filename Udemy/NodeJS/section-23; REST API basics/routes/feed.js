const express = require('express');
const expressValidator = require('express-validator');

const router = express.Router();

const feedController = require('../controllers/feed');

// handling GET /feed/posts
router.get('/posts', feedController.getPosts);

// handling POST /feed/post
router.post(
  '/post',
  [
    expressValidator.body('title').trim().isLength({ min: 5 }),
    expressValidator.body('content').trim().isLength({ min: 5 }),
  ],
  feedController.postPost
);

// handling single post GET /feed/post/:postId
router.get('/post/:postId', feedController.getAPost);

// handling editing post PUT /feed/post/:postId
router.put(
  '/post/:postId',
  [
    expressValidator.body('title').trim().isLength({ min: 5 }),
    expressValidator.body('content').trim().isLength({ min: 5 }),
  ],
  feedController.editPost
);

// handling deleting post DELETE /feed/post/:postId
router.delete('/post/:postId', feedController.deletePost);

module.exports = router;
