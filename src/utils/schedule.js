"use strict";

var schedule = require('node-schedule'),
    Order    = require('../order/order.model'),
    errors   = require('../errors'),
    Socket   = require('../socket/socket.model'),
    update   = require('../analysis/analysis.controller/update'),
    debug    = require('debug')('Order');

var emitOrderWithGrade = schedule.scheduleJob( '*/5 * * * * *', function(){
    Socket.broadCastDriver('action', 'RENEW_ORDER_LIST' );
});

var emitAnalysisData = schedule.scheduleJob( '*/20 * * * * *', function(){
    // update();
});

// var confirmOverTimeOrder = schedule.scheduleJob( '*/5 * * * * *',async function(){
//     let time = new Date(),
//         conditions = { $and:[ { status: 'new' }] };

//     time.setMinutes( time.getMinutes() - 1);
//     // time.setSeconds(time.getSeconds()-30);
//     conditions.$and.push( { updatedAt: { $lte: time} } );

//     try{
//         let overtimeOrder = await Order.find(conditions);
        
//         overtimeOrder = overtimeOrder.map( item => new Promise( async resovle=>{
//             const socket = await Socket.findOne({ user: item.orderBy });
//             if(socket){
//                 socket.emitSocket('action', 'ORDER_OVERTIME_CONFIRM' );
//                 item.overtime = true;
//             }else{
//                 item.status = 'badOrder';
//             }
//             await item.save();
//             return resovle(item);
//             // return resovle(socket);
//         }));

//         overtimeOrder = await Promise.all(overtimeOrder);
//     }catch( error ){
//         console.log(error);
//     }
// });

// var delOverTimeOrder = schedule.scheduleJob( '*/5 * * * * *',async function(){
//     let time = new Date(),
//         conditions = { $and:[ { overtime: true }] };

//     time.setMinutes( time.getMinutes() - 2);
//     conditions.$and.push( { updatedAt: { $lte: time} } );

//     try{
//         let delableOvertimeOrder = await Order.update( conditions, { $set: { status: 'badOrder' }});
//     }catch( error ){
//         console.log(error);
//     }
// });

module.exports = {
    emitOrderWithGrade,
    emitAnalysisData
    // confirmOverTimeOrder,
    // delOverTimeOrder
};