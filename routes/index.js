// centralised part for all other routes

const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('router loaded');

router.get('/', homeController.home);

// this route handles the users request
router.use('/users', require('./users'));

router.use('/posts', require('./posts'));

module.exports = router;