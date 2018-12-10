"use strict";

const Order    = require('../order.model'),
      debug    = require('debug')('Order'),
      apiError = require('server-api-errors'),
      errors   = require('../../errors'),
      Socket   = require('../../socket/socket.model.js');

const entry = async( req, res, next) => {

    switch( req.body.type ){

        /**
         * 
         * Accept order by driver
         * 
         */
        case 'accept':
            if ( req.user.type != 'driver')
                return next( apiError.Forbidden(errors.ValidationError('Only driver can accept order')));   
            if ( req.order.status != 'new')
                return next( apiError.Forbidden(errors.ValidationError('Already accepted')));   
            return accept( req, res, next );

        /**
         * 
         * User cancel the order
         * 
         */
        case 'cancel':
            if ( req.user.type != 'user')
                return next( apiError.Forbidden(errors.ValidationError('Only user can cancel order')));   
            return cancelByUser( req, res, next );
            // if ( req.user.type == 'driver')
            //     return cancelByDriver( req, res, next );

        /**
         * 
         * Driver release order
         * 
         */
        case 'release':
            if ( req.user.type != 'driver')
                return next( apiError.Forbidden(errors.ValidationError('Only driver can release order')));   
            return release( req, res, next );

        default: 
            return next( apiError.Forbidden(errors.MissingParameter('Invalid or missing action type. ')));   
    };
};

async function accept( req, res, next ){

    try{
        let order = req.order;
        
        let socket = await Socket.findOne({ user: order.orderBy });

        if(!socket)
            return next( apiError.InternalServerError('orderer is offline'));
         
        socket.emitSocket('action', Socket.type.DRIVER_ACCEPT );

        order.status = 'accepted';
        order.acceptBy = req.user._id;
        order = await order.save();

        socket = await Socket.findOne({ user: order.orderBy });

        if ( socket ){
            socket.emitSocket('action', Socket.type.DRIVER_ACCEPT );
            return res.json({ status: 1, data: order });
        } else {
            await Order.update({ order: order._id }, { status: 'badOrder'} );
            return res.json({ status: 0 });
        };
                    
    } catch ( error ){
        console.log(error);
        return next( apiError.InternalServerError());   
    };

};

async function cancelByUser( req, res, next ){
    
    try{
        let order = req.order;
        order.status = 'canceled';
        order = await order.save();
        return res.json({ data: order });
    } catch ( error ){
        return next( apiError.InternalServerError());   
    };

};

async function cancelByDriver( req, res, next ){
    try{
        let order = req.order;
        order.status = 'canceled';
        order = await order.save();
        return res.json({ data: order });
    } catch ( error ){
        return next( apiError.InternalServerError());   
    };
}

async function release( req, res, next ){
    
    try{
        let order = req.order;
        order.status = 'new';
        order.acceptBy = null;
        order = await order.save();
        return res.json({ data: order });
    } catch ( error ){
        return next( apiError.InternalServerError());   
    };

};


module.exports = exports = entry;