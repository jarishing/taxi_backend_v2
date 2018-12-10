const express = require('express');
const userController = require('./user.controller');
const router = express.Router();
const auth = require('../utils/auth.js');

router.use('/order', require('../user.order/user.order.route'));
router.use('/comment', require('../user.comment/user.comment.route'));
router.use('/ban', require('../user.ban/user.ban.route'));

router.route('/login')
    // login route
    .post( userController.login );

router.route('/')
    .get( userController.list )
    .post( userController.create );

router.get('/:userId', auth, userController.get );

router.param('userId', userController.load );

module.exports = router;