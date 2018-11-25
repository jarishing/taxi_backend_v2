const Order    = require('../order.model'),
      debug    = require('debug')('Order'),
      apiError = require('server-api-errors'),
      errors   = require('../../errors');

async function getOrders( req, res, next ){

    const condition = {};

    if ( req.query.status )
        condition.status = req.query.status;

    try {
        const orders = Order.find(condition).lean();
        return res.json({
            data: orders,
            count: orders.length
        });
    } catch( error ){
        console.error(error)
        return next( apiError.InternalServerError() );
    };

};

module.exports = exports = getOrders;