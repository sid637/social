const Comment = require('../models/comment');
const Post = require('../models/post');


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