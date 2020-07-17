const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
// module which will helps in extract jwt from the header
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

// way to include JWT in a request, This callback, from now on referred to as an extractor,
let opts = { 
    // header contains keys which have a key call authorization and this keys contains a bearer which will have the jwt token
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    // encryption and decryption key
    secretOrKey: 'codeial'
}


passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){
    // find the user based on payload
    User.findById(jwtPayLoad._id, function(err, user){
        if(err){
            console.log('Error in finding user from JWT');
            return;
        }
        
        if(user){
            return done(null, user);
        }else{
            return done(null, false);
        }
    })
}));

module.exports = passport;