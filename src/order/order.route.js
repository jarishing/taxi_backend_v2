const orderController = require('./order.controller'),
      express = require('express'),
      auth = require('../utils/auth'),
      router = express.Router();

router.route('/')
    .get( auth, orderController.list )
    .post( auth, orderController.create );

router.route('/:orderId')
    .get( auth, orderController.get )
    .post( auth, orderController.actions );

router.param('orderId', orderController.load );

module.exports = router;