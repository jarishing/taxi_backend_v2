"use strict";

const express = require('express'),
      placeController = require('./place.controller'),
      router = express.Router();

router.route('/')
    .get( placeController.find );

router.get('/address',placeController.getLocationAddress );

router.post('/path', placeController.path );
    

module.exports = router;