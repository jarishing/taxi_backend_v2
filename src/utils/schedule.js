"use strict";

var schedule = require('node-schedule'),
    Order    = require('../order/order.model'),
    errors   = require('../errors'),
    Socket   = require('../socket/socket.model'),
    debug    = require('debug')('Order');

var emitOrderWithGrade = schedule.scheduleJob( '*/5 * * * * *', function(){
    Socket.broadCastDriver('action', 'RENEW_ORDER_LIST' );
});

var delOvertimeOrder = schedule.scheduleJob( '*/1 * * * *',async function(){
    let time = new Date(),
        conditions = { $and:[ { status: 'new' }] };

    time.setMinutes(time.getMinutes()-4);
    conditions.$and.push( { createdAt: { $lte: time} } );

    try{
        Order.updateMany( conditions, { $set: { status: 'badOrder'}}).exec();
    }catch( error ){
        console.error(error)
        return next( apiError.InternalServerError() );
    };
});

module.exports = {
    emitOrderWithGrade,
    delOvertimeOrder
};