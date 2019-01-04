const User = require('../user.model'),
      apiError = require('server-api-errors'),
      errors = require('../../errors'),
      debug = require('debug')('User'),
      login = require('./login.js');

const entry = ( req, res, next ) => {
    console.log(req.body.type);
    switch( req.body.type ){
        case 'admin':
            return createAdmin(req, res, next);
        case 'driver':
            return createDriver(req, res, next);
        case 'user': 
            return createUser(req, res, next);
        default:
            return next( apiError.BadRequest( errors.MissingParameter("type")));
    }
};

let setupIsDone = false;

async function createAdmin(req, res, next){
    if( setupIsDone )
        return next( apiError.BadRequest(errors.UserExists()));
    
    try{
        let admin = new User({
            type        : 'admin',
            username    : 'admin',
            email       : 'admin@admin.com',
            valid       : true
        });

        admin.setPassword('123456');
        admin = await admin.save();
        setupIsDone = true;
        return login(req, res, next );
    } catch( error ){
        debug(error);
        return next( apiError.InternalServerError());
    }
};

async function createDriver(req, res, next){
    
    const { type, username, email, telephone_no, password, vehicle_reg_no, taxi_driver_id_photo } = req.body;

    console.log( type, username, email, telephone_no, password, vehicle_reg_no, taxi_driver_id_photo );
    const details = [];
    for ( const field of ['username', 'telephone_no', 'password', 'vehicle_reg_no', 'taxi_driver_id_photo'])
        if ( req.body[field] === undefined)
            details.push( errors.MissingParameter( field ));
        
    if ( details.length > 0 )
        return next( apiError.BadRequest(details));

    try {

        let driver = await User.findOne({ telephone_no: telephone_no });
     
        if ( driver )
            return next( apiError.BadRequest(errors.UserExists()));

        driver = await User.create({ type, username, email, telephone_no, vehicle_reg_no, taxi_driver_id_photo  }, password );
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

        let user = await User.findOne({ telephone_no: telephone_no });

        if ( user )
            return next( apiError.BadRequest(errors.UserExists()));

        let valid = true;
        user = await User.create({ type, username, email, telephone_no, valid }, password );
        return login(req, res, next );
    } catch( error ){   
        debug(error);
        return next( apiError.InternalServerError());
    };

};

module.exports = exports = entry;