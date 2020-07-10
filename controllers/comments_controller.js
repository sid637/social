const Comment = require('../models/comment');
const Post = require('../models/post');


module.exports.create = function(req, res){
    // req.body.post here is re from hidden input
    Post.findById(req.body.post, function(err, post){

        // if post exists then create a comment
        if(post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment){

                if(err){
                    console.log('Error in creating the comment');
                    return;
                }

                // update
                post.comments.push(comment);
                // to save in the database
                post.save();

                res.redirect('/');

            });
        }
    });
}