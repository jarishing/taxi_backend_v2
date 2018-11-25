"use strict";

module.exports = exports = {
    /**
     * 
     * Create and validate user document
     * 
     */
    create: require('./create.js'),
    /**
     * 
     * Get User document
     * 
     */
    get: require('./get.js'),
    /**
     * 
     * Login
     * 
     */
    login: require('./login.js'),

    load : require('./load')
};