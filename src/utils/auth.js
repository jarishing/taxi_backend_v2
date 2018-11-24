const jwt = require("express-jwt"),
      auth = jwt({ secret: process.env.SECRET_KEY }),
      apiError = require('server-api-errors'),
      errors = require('../errors'),
      User = require('../user/user.model');

async function getUser(req, res, next){
    try {
        const user = User.findById( req.user._id );
        req.user = user;
        return next();
    } catch ( error ){
        return next( apiError.BadRequest() );
    }
};

async function valid(req, res, next){
    if ( req.user.valid != true )
        return next( apiError.Forbidden());
    return next();
}

async function admin(req, res, next){
    if ( req.user.type != 'admin')
        return next(apiError.Forbidden());
    return next();
};

async function user(req, res, next){
    if ( req.user.type != 'user')
        return next(apiError.Forbidden());
    return next();
};

module.exports = exports = [ getUser, valid, auth ];
exports.admin = [ getUser, valid, auth, admin ];
exports.user = [ getUser, valid, auth, user ];