const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const User = require('../models/user');
require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        let user = await User.findOne({email: req.body.email});
        if (user) {
            return res.status(403).json({message: "Email already exists!"});
        }
        user = await User(req.body);
        await user.save();
        return res.status(200).json({user});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err})
    }
    
}

exports.signin = (req, res) => {
    const {email, password} = req.body;
    // find the user
    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                message: 'User not found'
            });
        }

        // if user found match the password (Authenticate)
        if (!user.authenticate(password)) {
            return res.status(401).json({message: 'Invalid email or password!'})
        }

        // Create jsontoken and send response
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        //set cookie
        res.cookie('t', token, {expire: new Date() + 9999});
        let {_id, email, name } = user;

        // send response
        return res.json({token, user: {_id, email, name}});
    })
}

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({message: 'You signout successfully.'});
}

exports.requireAuthentication = expressJwt({
    // If the user is authenticated express-jwt append userId to auth key to the request object.
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});