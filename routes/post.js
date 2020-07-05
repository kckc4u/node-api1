const {getPosts, createPost, getPostsByUser, getPostById, deletePost, isPoster, updatePost} = require('../controllers/post');
const validator = require('../validators');
const express = require('express');
const {requireAuthentication} = require('../controllers/auth');
const {userById} = require('../controllers/user');

let router = express.Router();

// To get authorize send "Authorization" key in header and Bearer <JWT token> as value
// Authorization: Bearer [token]
router.get('/', getPosts);

router.post('/add/:userId', requireAuthentication, createPost, validator.validatePost);

router.get('/by/:userId', requireAuthentication, getPostsByUser);

router.delete('/:postId', requireAuthentication, isPoster, deletePost);

router.put('/:postId', requireAuthentication, isPoster, updatePost);
// Anytime when :userId coming as parameter with any request execute following handler
router.param('userId', userById);
router.param('postId', getPostById);

module.exports = router;