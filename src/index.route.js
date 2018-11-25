const express = require("express");
const router = express.Router();

// Check service health
router.get('/health-check', (req, res) => res.send('OK'));

router.use('/user', require('./user/user.route'));

router.use('/place', require('./place/place.route'));

router.use('/order', require('./order/order.route'));

module.exports = router;