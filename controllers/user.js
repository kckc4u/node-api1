const User = require('../models/user');
const { use } = require('../routes/post');
const _ = require('lodash');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found."
            });
        }
        req.profile = user;
        
        next();
    })
};

exports.hasAuthorization = (req, res, next) => {
    let authorised = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!authorised) {
        return res.status(403).json({
            error: "You are not Authorised."
        });
    }

    next();
};

exports.getAllUsers = (req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.status(400).json({error: err});
        }
        res.json({users});
    }).select("_id name email created updated ")
}

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}

exports.updateUser = (req, res) => {
    let user = req.profile;
    console.log(req.body);
    user = _.extend(user, req.body);
    user.updated = Date.now();

    user.save((err, user) => {
        if (err) {
            return res.status(400).json({error: err});
        }

        user.hashed_password = undefined;
        user.salt = undefined;

        res.json({user});
    })
}

exports.deleteUser = (req, res) => {
    let user = req.profile;
    user.remove((err) => {
        if (err) {
            return res.status(403).json({
                error: err
            });
        }

        res.json({
            message: "User deleted successfully."
        });
    })
}