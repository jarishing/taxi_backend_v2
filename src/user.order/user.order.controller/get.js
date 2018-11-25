const Order    = require('../../order/order.model'),
      apiError = require('server-api-errors'),
      errors   = require('../../errors'),
      debug    = require('debug')('User');

const entry = async( req, res, next ) => {

    switch( req.user.type ){
        case 'user':
            return user( req, res, next );
        case 'driver':
            return driver( req, res, next );
        default: 
            return next( apiError.BadRequest( errors.ValidationError('Invalid user type', 'type')));
    };

};

async function user( req, res, next ){

    const conditions = { orderBy: req.user._id };

    if ( req.query.status )
        conditions.status = req.query.status;
    
    try {
        const orders = await Order.find(conditions).lean();
        return res.json({
            data: orders,
            count: orders.length
        });
    } catch( error ){
        debug(error)
        return next( apiError.InternalServerError() );
    };

}

async function driver( req, res, next ){
    
    const conditions = { acceptBy: req.user._id };

    if ( req.query.status )
        conditions.status = req.query.status;
    
    try {
        const orders = await Order.find(conditions).lean();
        return res.json({
            data: orders,
            count: orders.length
        });
    } catch( error ){
        debug(error)
        return next( apiError.InternalServerError() );
    };

}

module.exports = exports = entry;