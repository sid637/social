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

module.exports.destroy = function(req, res){
    Comment.findById(req.params.id, function(err, comment){
        // to check in the databse if comment actually exists or not
        if(comment.user == req.user.id){
            // we have to save postis before comment removal
            let postId = comment.post;

            comment.remove();
                // $pull is mongo syntax, this pulls and throws the id matching with the comment id
            Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}}, function(err, post){
                return res.redirect('back');
            });
        }else{
            return res.redirect('back');
        }
    });
}