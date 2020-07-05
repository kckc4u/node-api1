const express = require('express');
const authController = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { validateUser } = require('../validators');

let router = express.Router();

router.get('/profile', (req, res) => {
    res.json({user: "User data"});
})

router.post('/signup', validateUser, authController.signup)

router.post('/signin', authController.signin);

router.get('/signout', authController.signout);

// Anytime when :userId coming as parameter with any request execute following handler
router.param('userId', userById);

module.exports = router;