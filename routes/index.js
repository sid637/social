// centralised part for all other routes

const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');
const reset_password_enter_email_router=require('./reset_password_enter_email');

console.log('router loaded');

router.get('/', homeController.home);

// this route handles the users request
router.use('/users', require('./users'));

router.use('/posts', require('./posts'));

router.use('/comments', require('./comments'));

router.use('/reset_password', reset_password_enter_email_router);

router.use('/likes', require('./likes'));

// api
router.use('/api', require('./api'));

module.exports = router;