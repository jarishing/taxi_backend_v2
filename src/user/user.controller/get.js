const User     = require('../user.model'),
      debug    = require('debug')('User'),
      apiError = require('server-api-errors'); 

async function get(req, res, next){
    const userId = req.user._id;

    try {
        const user = await User
                                .findById(userId)
                                .select('-__v -salt -hash')
                                .lean();
        return res.send({ data: user });
    } catch( error ){
        debug(error)
        return next( apiError.BadRequest() );
    }

};

module.exports = exports = get;