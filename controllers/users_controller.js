const User = require('../models/user');
const fs = require('fs');
const Friendship = require('../models/friendship');
const path = require('path');

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(error, user){

        if (error)
        {
            console.log('error in finding the user profile!');
            return;
        }

        let are_friends = false;

        Friendship.findOne({
            $or: [{ from_user: req.user._id, to_user: req.params.id },
            { from_user: req.params.id, to_user: req.user._id }]
        }, function (error, friendship)
        {
            if (error)
            {
                console.log('There was an error in finding the friendship', error);
                return;
            }
            if (friendship)
            {
                are_friends = true;
            }
            /* console.log(req.user);
            console.log(req.user._id, '********', req.params.id, '*******') */
            var options =
            {
                user_name: "Siddharth Sharma",
                title: "Codeial",
                profile_user: user,/* it is the user whose profile i am currently browsing */
                are_friends: are_friends
            }
            return res.render('user_profile', options);
        })




        // return res.render('user_profile', {
        //     title: 'User Profile',
        //     profile_user: user
        // });
    })
    
}

module.exports.update = async function(req, res){

    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err,user){
    //         return res.redirect('back');
    //     });
    // }else{
    //     // if someone fiddles with our html code
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('*****Multer Error: ', err);
                }

                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){

                    if (user.avatar){
                        if (fs.existsSync(path.join(__dirname, '..', user.avatar))){
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                        };
                        
                    }

                    // this is saving the path of uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;

                }

                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }



    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }

}

// render the sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }


    return res.render('user_sign_up',{
        title: "Codeial | Sign Up"
    });
}
// render the sign in page
module.exports.signIn = function(req, res){

    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }

    return res.render('user_sign_in',{
        title: "Codeial | Sign In"
    });
}

// get the sign up data
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up');return }
        
        // if user is not exists then create a user
        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in finding user in signing up');return }

                return res.redirect('/users/sign-in');

            });

           

        }else{
            // if user exists
            return res.redirect('back');
        }

    });


}

// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully')
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have Logged Out')

    return res.redirect('/users/sign-in');
}