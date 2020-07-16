const User = require('../models/user');
const { use } = require('../routes/post');
const formidable = require('formidable');
const fs = require('fs');
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

exports.userPhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set('Content-type', req.profile.photo.contentType);
        return res.send(req.profile.photo.data);
    } else {
        console.log("Profile photo not found.");
        res.status(404).json({error: 'Profile photo not found.'});
    }
}

// exports.updateUser = (req, res) => {
//     let user = req.profile;
//     console.log(req.body);
//     user = _.extend(user, req.body);
//     user.updated = Date.now();

//     user.save((err, user) => {
//         if (err) {
//             return res.status(400).json({error: 'You are not authorized to perform this action.'});
//         }

//         user.hashed_password = undefined;
//         user.salt = undefined;

//         res.json({user});
//     })
// }

exports.updateUser = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'There are some error while updating user.'
            });
        }
        // save user
        let user = req.profile;
        user = _.extend(user, fields);
        user.updated = Date.now();

        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
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