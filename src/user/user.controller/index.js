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

<<<<<<< HEAD
    load : require('./load'),

    list : require('./list.js')
=======
    list: require('./list'),

    load : require('./load')
>>>>>>> origin
};