const express = require('express');
const userController = require('./user.controller');
const router = express.Router();
const auth = require('../utils/auth.js');

router.use('/:userId/order', require('../user.order/user.order.route'));

router.route('/login')
    // login route
    .post( userController.login );

router.route('/')
    .post( userController.create );

router.get('/:userId', auth, userController.get );

router.param('userId', userController.load );

module.exports = router;