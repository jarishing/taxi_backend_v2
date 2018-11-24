const express = require('express');
const userController = require('./user.controller');
const router = express.Router();
const jwt = require("express-jwt");
const auth = jwt({ secret: process.env.SECRET_KEY });

router.route('/setup')
    // used to setup default admin account
    .get( userController.setup );

router.get('/me', auth, userController.getMyProfile );

router.route('/login')
    // login route
    .post( userController.login );

module.exports = router;