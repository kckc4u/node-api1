const express = require('express');
const { getAllUsers, userById, getUser, updateUser, deleteUser } = require('../controllers/user');
const { requireAuthentication } = require('../controllers/auth');
const router = express.Router();

router.get('/users', getAllUsers);

router.get('/user/:userId', requireAuthentication, getUser);

router.put('/user/:userId', requireAuthentication, updateUser);

router.delete('/user/:userId', requireAuthentication, deleteUser);

router.param('userId', userById);

module.exports = router;