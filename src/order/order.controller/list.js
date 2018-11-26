const Order    = require('../order.model'),
      debug    = require('debug')('Order'),
      apiError = require('server-api-errors'),
      errors   = require('../../errors');

async function getOrders( req, res, next ){

    const condition = {};

    switch(req.query.status){

        case 'accepted':
            condition.status = req.query.status;
            if ( req.user.type == 'user' )
                condition.orderBy = req.user._id;
            else if ( req.user.type == 'driver' )
                condition.acceptBy = req.user._id;
            else    
                return next( apiError.BadRequest());

        case 'commented':
            if ( req.user.type == 'user' ){
                condition.status = req.query.status;
                condition.orderBy = req.user._id;
                break;
            } else
                return next( apiError.BadRequest());
               
        case 'new':
        default:
            condition.status = 'new';
            break;
    };

    try {

        const orders = await Order
                                .find(condition)
                                .populate('orderBy acceptBy')
                                .lean();

        return res.json({ data: orders, count: orders.length });
    } catch( error ){
        console.error(error)
        return next( apiError.InternalServerError() );
    };

};

module.exports = exports = getOrders;