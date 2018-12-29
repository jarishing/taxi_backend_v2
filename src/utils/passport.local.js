const LocalStrategy = require("passport-local").Strategy,
      User          = require("../user/user.model"),
      apiError      = require("server-api-errors"),
      debug         = require('debug')('passport'),
      errors        = require('../errors');
      
async function Validate(telephone_no, password, callback){
    try {
        const user = await User.findOne({ telephone_no: telephone_no });
        if ( user ){
            if ( user.validPassword(password) == false )
                return callback(null, null, errors.ValidationError("Password not match", "password"));
            return callback(null, user, null);
        } else 
            return callback(null, null, errors.ValidationError("User not found", "telephone_no"));
    } catch ( error ){
        debug(error);
        return callback(error, null, apiError.InternalServerError() );
    }
};

module.exports = exports = new LocalStrategy({usernameField: 'telephone_no'}, Validate);