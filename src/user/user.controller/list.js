const User = require('../user.model'),
      Socket = require('../../socket/socket.model'),
      apiError = require('server-api-errors'),
      errors = require('../../errors'),
      debug = require('debug')('User');

module.exports = exports = async function list(req, res, next){
  
    const user = req.user;

    let users;

    switch ( user.type ){

        case "user":

            users = await Socket.find({ type: 'driver' }).populate('user').lean();
            return res.json({ data: users });
        
        case "driver":

            users = await Socket.find({ type: 'user' }).populate('user').lean();
            return res.json({ data: users });


        case "admin":
            return next(apiError.NotImplemented());

        default: 
            return next(apiError.BadRequest());

    };
    
};