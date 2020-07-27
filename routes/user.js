const express = require('express');
const { 
    getAllUsers, 
    userById, 
    getUser, 
    updateUser, 
    deleteUser, 
    userPhoto,
    addFollower,
    addFollowing,
    removeFollower,
    removeFollowing } = require('../controllers/user');
const { requireAuthentication } = require('../controllers/auth');
const router = express.Router();

router.get('/users', getAllUsers);

router.get('/user/:userId', requireAuthentication, getUser);

router.get('/user/photo/:userId', userPhoto);

router.put('/user/follow', requireAuthentication, addFollowing, addFollower);

router.put('/user/unfollow', requireAuthentication, removeFollowing, removeFollower);

router.put('/user/:userId', requireAuthentication, updateUser);

router.delete('/user/:userId', requireAuthentication, deleteUser);

router.param('userId', userById);

module.exports = router;