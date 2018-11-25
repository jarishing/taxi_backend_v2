const User = require('../user.model'),
      apiError = require('server-api-errors'),
      errors = require('../../errors'),
      debug = require('debug')('User'),
      login = require('./login.js');

const entry = ( req, res, next ) => {

    switch( req.body.type ){
        case 'driver':
            return createDriver(req, res, next);
        case 'user': 
            return createUser(req, res, next);
        default:
            return next( apiError.BadRequest( errors.MissingParameter("type")));
    }
};

async function createDriver(req, res, next){
    
    const { type, username, email, telephone_no, password, vehicle_reg_no, taxi_driver_id_no } = req.body;

    const details = [];
    for ( const field of ['username', 'email', 'telephone_no', 'password', 'vehicle_reg_no', 'taxi_driver_id_no'])
        if ( req.body[field] === undefined)
            details.push( errors.MissingParameter( field ));
    if ( details.length > 0 )
        return next( apiError.BadRequest(details));

    try {

        let driver = await User.findOne({ email: email });

        if ( driver )
            return next( apiError.BadRequest(errors.UserExists()));

        driver = await User.create({ type, username, email, telephone_no, vehicle_reg_no, taxi_driver_id_no  }, password );
        return login(req, res, next );
    } catch( error ){   
        debug(error);
        return next( apiError.InternalServerError());
    };
    
};

async function createUser(req, res, next){

    const { type, username, email, telephone_no, password } = req.body;

    const details = [];
    for ( const field of ['username', 'email', 'telephone_no', 'password'])
        if ( req.body[field] === undefined)
            details.push( errors.MissingParameter( field ));

    if ( details.length > 0 )
        return next( apiError.BadRequest(details));

    try {

        let user = await User.findOne({ email: email });

        if ( user )
            return next( apiError.BadRequest(errors.UserExists()));

        user = await User.create({ type, username, email, telephone_no }, password );
        return login(req, res, next );
    } catch( error ){   
        debug(error);
        return next( apiError.InternalServerError());
    };

};

module.exports = exports = entry;