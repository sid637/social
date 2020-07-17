const express = require('express');
const router = express.Router();
const passport = require('passport');


const usersController = require('../controllers/users_controller');
const postsController = require('../controllers/posts_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);


router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);


//  to create a user
router.post('/create', usersController.create);

// used passport as a middleware to authenticate
// here if authentication is done then done fn is called else page gets redirect to passport.authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'}
), usersController.createSession);

router.get('/sign-out', usersController.destroySession);

// routes for google oauth
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);

module.exports = router;