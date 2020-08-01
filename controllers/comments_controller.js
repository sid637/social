const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');
module.exports.create = async function(req, res){
   try{
        // req.body.post here is re from hidden input

        let post = await Post.findById(req.body.post);

        // if post exists then create a comment
     if(post){
       let comment = await Comment.create({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id
        });

            // update
        post.comments.push(comment);
            // to save in the database
        post.save();

        // populate user everytime because of mailer
        comment = await comment.populate('user', 'name email').execPopulate();
        // commentsMailer.newComment(comment);
        let job = queue.create('emails', comment).save(function(err){
            if(err){
                console.log('error in sending to the queue', err);
                return;
            }

            console.log('job enqueued', job.id);
        })
       
        
        if(req.xhr){
            // to fetch users id

            return res.status(200).json({
                data: {
                    comment: comment
                },
                message: "Comment Created!"
            });
        }

         req.flash('success', 'Comment published!');

        res.redirect('/');
        }

       
    }catch(err){
        req.flash('error', err);
       return;
   }
   
    
}


module.exports.destroy = async function(req, res){
    try{

        let comment = await Comment.findById(req.params.id);

        // to check in the databse if comment actually exists or not
        if(comment.user == req.user.id){

            // we have to save postis before comment removal

            let postId = comment.post;

            comment.remove();
            // $pull is mongo syntax, this pulls and throws the id matching with the comment id
            let post =  Post.findByIdAndUpdate(postId,
                 { $pull: {comments: req.params.id}});

                //  destroy the associated likes for this comment
                await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

                 // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }



               
                req.flash('success', 'Comment deleted!');
                return res.redirect('back');
        }else{
                req.flash('error', 'Unauthorized');
                return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        return;
    }
}