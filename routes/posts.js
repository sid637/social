const express = require('express');
const router = express.Router();

const passport = require('passport');

const postController = require('../controllers/posts_controller');

// putted a check if someone is not signed will not be able to post
router.post('/create',passport.checkAuthentication , postController.create);



module.exports = router;