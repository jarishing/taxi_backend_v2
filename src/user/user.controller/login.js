const passport = require("passport"),
      debug    = require('debug')('User'),
      errors   = require('server-api-errors'); 

async function login( req, res, next ){
    passport.authenticate('local', function( error, user, info ){
        if ( error )
            return next( errors.InternalServerError() );
        if ( user ){
            const token = user.generateJwt();
            return res.send({ access_token: token, user });
        } else 
            return next( errors.Unauthorized( info ) );
    })(req, res, next);
};

module.exports = exports = login;