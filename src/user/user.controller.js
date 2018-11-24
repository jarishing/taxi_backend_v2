const User     = require('./user.model'),
      passport = require("passport"),
      debug    = require('debug')('User'),
      errors   = require('server-api-errors'); 

const login = async( req, res, next ) => {
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

const getMyProfile = async( req, res, next ) => {
    const user = await User
                        .findById(req.user._id)
                        .select('-__v -salt -hash')
                        .lean();
    return res.send(user);
};

module.exports = { login, getMyProfile };