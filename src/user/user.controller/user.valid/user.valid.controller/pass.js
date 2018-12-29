const User = require('../../../user.model'),
      debug = require('debug')('User'),
      apiError = require('server-api-errors');

async function pass( req, res, next ){
    try{
        const validUser = await User.findById(req.params.userId);

        if(!validUser)
            return next( apiError.BadRequest(errors.DocumentNotFound('User')));

        validUser.valid = true;
        await validUser.save();
        return res.json({
            data: validUser
        })
    } catch( error ){
        debug(error)
        return next( apiError.InternalServerError() );
    }
};

module.exports = exports = pass;