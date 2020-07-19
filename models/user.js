const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');
const crypto = require('crypto'); // part of Nodejs lib

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    
    salt: String,
    
    created: {
        type: Date,
        default: Date.now
    },

    updated: Date,
    photo: {
        data: Buffer,
        contentType: String,
    },
    about: {
        type: String,
        trim: true
    },
    following: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
});

// virtual field
userSchema
    .virtual("password")
    .set(function(password) {
        // create temporary variable called _password
        this._password = password;
        // generate a timestamp
        this.salt = uuidv4();
        // encryptPassword()
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

// methods
userSchema.methods = {
    authenticate: function(password) {
        return this.encryptPassword(password) == this.hashed_password;
    },
    
    encryptPassword: function(password) {
        if (!password) return "";
        try {
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
    }
};

module.exports = mongoose.model('User', userSchema);