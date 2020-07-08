const Post = require("../models/post");

module.exports.home = function(req,res){
    // console.log(req.cookies);
    // res.cookie('user_id',25);

    // Post.find({}, function(err, posts){
        
    //     return res.render('home.ejs',{
    //         title: "Codeial | Home",
    //         posts: posts
    //     });

    // finding the post and populating the user of each post
    // just need to prepopulate the user and we need to do call back in exec
    Post.find({}).populate('user').exec(function(err, posts){

        return res.render('home.ejs',{
                    title: "Codeial | Home",
                    posts: posts
                });

    });
    
}