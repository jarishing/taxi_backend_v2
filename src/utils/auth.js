const jwt = require("express-jwt"),
      auth = jwt({ secret: process.env.SECRET_KEY }),
      apiError = require('server-api-errors'),
      errors = require('../errors'),
      User = require('../user/user.model'),
      debug = require('debug')('Auth');



async function getUser(req, res, next){
    try {
        const user = await User.findById( req.user._id );

        if ( !user )
            return next( apiError.BadRequest( errors.DocumentNotFound('User')) );
        req.user = user;
        return next();
    } catch ( error ){
        debug(error);
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

module.exports = exports = [ auth, getUser, valid ];
exports.admin = [ auth, getUser, valid, admin ];
exports.user = [ auth, getUser, valid,  user ];