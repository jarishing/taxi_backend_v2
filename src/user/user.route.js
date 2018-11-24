const express = require('express');
const userController = require('./user.controller');
const router = express.Router();
const auth = require('../utils/auth.js');

router.get('/:userId', auth, userController.get );

router.route('/login')
    // login route
    .post( userController.login );

router.route('/')
    .post( auth, userController.create );

module.exports = router;