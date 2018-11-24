const express = require("express");
const router = express.Router();

// Check service health
router.get('/health-check', (req, res) => res.send('OK'));

router.use('/user', require('./user/user.route'));

router.use('/place', require('./place/place.route'));

module.exports = router;