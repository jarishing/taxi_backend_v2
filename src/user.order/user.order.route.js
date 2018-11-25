const express = require('express'),
      userOrderController = require('./user.order.controller'),
      router = express.Router(),
      auth = require('../utils/auth.js');

router.get('/', auth, userOrderController.get );

module.exports = router;