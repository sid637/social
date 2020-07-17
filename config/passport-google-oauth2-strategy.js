const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const { access } = require('fs');




// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: "469209458720-0j8isc2sqjoq1v0k589aa3pp4pr45bjf.apps.googleusercontent.com",
    clientSecret: "PCvLwuHcCmJ_MtybWenwvdFY",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
},
// A refresh token is a special kind of token that can be used to obtain a renewed access token
    function(accessToken, refreshToken, profile, done){
        // emails is for users multiple account
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log('error in google strategy-passport', err);
                return;
            }

            console.log(accessToken, refreshToken);

            console.log(profile);

            if(user){
                // if found, set this user as req.user
                return done(null, user);
            }else{
                // if not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){
                        console.log('error in creating user google strategy-passport', err);
                        return;
                    }
                    
                    return done(null, user);
                });
            }
        });
    }

));


module.exports = passport;