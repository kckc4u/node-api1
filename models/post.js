const mongoose = require('mongoose');

postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "Title is required.",
        minlength: 4,
        maxlength: 150
    },
    body: {
        type: String,
        required: "Post body is required.",
        minlength: 4,
        maxlength: 2000
    },
    created: {
        type: Date,
        default: Date.now
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    updated: Date,
});

module.exports = mongoose.model('Post', postSchema);