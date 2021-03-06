const Post = require('../models/post');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.getPosts = (req, res) => {
    Post.find()
    .populate("postedBy", "_id name")
    .select("_id title postedBy created body likes")
    .sort({"created": "desc"})
    .then((posts => {
        res.json({posts});
    }))
    .catch(err => console.log(err));
}

exports.getPostById = (req, res, next, id) => {
    Post.findById(id)
    .populate("postedBy", "_id name")
    .populate('comments.postedBy', '_id name')
    .select("_id title postedBy created body likes comments photo")
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

exports.getPhoto = (req, res, next) => {
    if (req.post.photo.data) {
        res.set('Content-type', req.post.photo.contentType);
        return res.send(req.post.photo.data);
    } 

    return res.status(404).json({error: 'Post photo not found.'});
}

exports.isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth.id;
    
    if (!isPoster) {
        return res.status(400).json({error: `You don't have access to delete this post.`});
    }

    next();
}

// exports.updatePost = (req, res) => {
//     let post = req.post;
//     post = _.extend(post, req.body);
//     post.updated = Date.now();
//     post.save((err, post) => {
//         if (err) {
//             return res.status(403).json({error: err});
//         }
//         res.json({post});
//     });
// }

exports.updatePost = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'There are some error while updating user.'
            });
        }
        // save post
        let post = req.post;
        post = _.extend(post, fields);
        post.updated = Date.now();

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json(result);
        });
    })
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

exports.singlePost = (req, res) => {
    req.post.photo = undefined;
    return res.json(req.post);
}

exports.getPostsByUser = (req, res) => {
    Post.find({postedBy: req.profile._id})
    .populate("postedBy", "_id name")
    .sort("created")
    .select("_id title body created")
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
}

exports.like = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, { $push: { likes: req.body.userId } }, { new: true })
    .exec(
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        }
    );
};

exports.unlike = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, { $pull: { likes: req.body.userId } }, { new: true })
    .exec(
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        }
    );
};

exports.comment = (req, res) => {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;

    Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};

exports.uncomment = (req, res) => {
    let comment = req.body.comment;

    Post.findByIdAndUpdate(req.body.postId, { $pull: { comments: { _id: comment._id } } }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};