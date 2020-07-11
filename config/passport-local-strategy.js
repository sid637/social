const passport = require('passport');

// need to require passport
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');




// authentication using passport
// need to require user
// we need to tell passport to use this local authentication
passport.use(new LocalStrategy(
    {
    usernameField: 'email',

    // this basically allows to set the first argument as request
    passReqToCallback: true
    },
    
    // callback function inbuilt
    // whenever a local strategy is called on email and password will be passed on
    // done(it is call back function reporting to passport.js) function will be called based on successful or unsuccessful
    function(req, email, password, done){
        // find a user and established their identity
        User.findOne({email: email}, function(err, user){
            if(err){
                req.flash('error', err);
                // console.log('Error in finding a user --> Passport');
                return done(err);
            }

            if(!user || user.password != password){
                req.flash('success', 'Invalid Username/Password');
                // console.log('Invalid Username/Password');

                // here err is null and authentication has not been done( i.e flase)
                return done(null, false);
            }

            // if the user is found
            return done(null, user);
        });
    }



));

// serializing the user to decide which key is to be kept in the cookie
// done can be any callback function
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding a user --> Passport');
            return done(err);
        }
        return done(null, user);
    });
});

// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    // if the user is not sign-in
    return res.redirect('/users/sign-in');

}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views

        res.locals.user = req.user;
        
    }
    
    next();
}

module.exports = passport;