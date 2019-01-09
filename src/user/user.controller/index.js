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

    list: require('./list'),

    load : require('./load'),

    update: require('./update'),
    /**
     * 
     * Delete Account
     * 
     */
    deleteAccount: require('./delete')
};