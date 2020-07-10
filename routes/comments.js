const express = require('express');
const router = express.Router();

const passport = require('passport');

const commentsController = require('../controllers/comments_controller');

// putted a check if someone is not signed will not be able to post
router.post('/create', passport.checkAuthentication , commentsController.create);

router.get('/destroy/:id', passport.checkAuthentication, commentsController.destroy);

module.exports = router;