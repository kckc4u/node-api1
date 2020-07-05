const Post = require('../models/post');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.getPosts = (req, res) => {
    // Post.find()
    // .then((posts => {
    //     res.json({posts});
    // }))
    // .catch(err => console.log(err));

    // select only few of elements
    Post.find()
    .populate("postedBy", "_id name")
    .select("_id title postedBy")
    .then((posts => {
        res.json({posts});
    }))
    .catch(err => console.log(err));
}

exports.getPostById = (req, res, next, id) => {
    Post.findById(id)
    .populate("postedBy", "_id name")
    .exec((err, post) => {
        if (err) {
            return res.status(400).json({error: err});
        }
        if (!post) {
            return res.status(404).json({error: 'Post not found.'});
        }

        req.post = post;
        next();
    })
}

exports.isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth.id;
    
    if (!isPoster) {
        return res.status(400).json({error: `You don't have access to delete this post.`});
    }

    next();
}

exports.updatePost = (req, res) => {
    let post = req.post;
    post = _.extend(post, req.body);
    post.updated = Date.now();
    post.save((err, post) => {
        if (err) {
            return res.status(403).json({error: err});
        }
        res.json({post});
    });
}

exports.deletePost = (req, res) => {
    let post = req.post;
    post.remove((err) => {
        if (err) {
            return res.status(400).json({error: err});
        }

        res.json({'message': 'Post deleted successfully.'});
    }
    );
}

exports.getPostsByUser = (req, res) => {
    Post.find({postedBy: req.profile._id})
    .populate("postedBy", "_id name")
    .sort("created")
    .exec((err, posts) => {
        if(err) {
            return res.status(400).json({error: err});
        }

        return res.json({posts});
    })
}

exports.createPost = (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        
        let post = new Post(fields);
        post.postedBy = req.profile;
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, post) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            post.postedBy.hashed_password = undefined;
            post.postedBy.salt = undefined;
            res.json({
                post,
                message: 'Post added successfully.'
            });
        })
    });

    // let postData = req.body;
    // let post = new Post(postData);

    // post.save((err, post) => {
    //     if (err) {
    //         return res.status(400).json({
    //             error: err
    //         });
    //     } 

    //     res.status(200).json(post);
    // });

    // post.save()
    // .then((result) => {
    //     res.status(200).json({post: result});
    // })
}