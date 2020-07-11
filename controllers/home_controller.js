const Post = require("../models/post");
const User = require('../models/user');
// module.exports.home =  function(req,res){
//     // console.log(req.cookies);
//     // res.cookie('user_id',25);

//     // Post.find({}, function(err, posts){
        
//     //     return res.render('home.ejs',{
//     //         title: "Codeial | Home",
//     //         posts: posts
//     //     });

//     // finding the post and populating the user of each post
//     // just need to prepopulate the user and we need to do call back in exec
    
//     //nested population 
//     Post.find({}).populate('user').populate({
//         path: 'comments',
//         populate: {
//             path: 'user'
//         }
//     }).exec(function(err, posts){

//         User.find({}, function(err, users){
//             return res.render('home.ejs',{
//                 title: "Codeial | Home",
//                 posts: posts,
//                 all_users: users
//             });

//         });

        

//     });
    
// }
//** */ with async await
module.exports.home = async function(req, res){

    try{
         // populate the user of each post
    let posts = await Post.find({})
    .populate('user').populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            });

    let users = await User.find({});

    return res.render('home.ejs',{
        title: "Codeial | Home",
        posts: posts,
        all_users: users
    });

    }catch(err){
        console.log('Error', err);
        return;
    }

       
}