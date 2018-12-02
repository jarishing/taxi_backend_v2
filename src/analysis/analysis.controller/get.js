"use strict";

const Analysis = require('../analysis.model'),
      Order    = require('../../order/order.model'),
      SocketMd = require('../../socket/socket.model'),
      debug    = require('debug')('Analysis'),
      apiError = require('server-api-errors');

const entry = async( req, res, next ) => {
    switch( req.query.page ){
        case 'main':
            return main( req, res, next );
        case 'data':
            return data( req, res, next );
        default:
            return next( apiError.BadRequest( errors.ValidationError('Invalid page type', 'type')));
    };
};

async function main( req, res, next ){
    try{
        let activeUser = SocketMd.find( { type: 'user' } ).lean().countDocuments(),
            activeDriver = SocketMd.find( { type: 'driver' } ).lean().countDocuments(),
            ordering = Order.find( { status: 'new' } ).lean().countDocuments(),
            analysisData = Analysis.findOne().sort({createdAt: -1});
        
        [ activeUser, activeDriver, ordering, analysisData ] = await Promise.all([ activeUser, activeDriver, ordering, analysisData ]);

        const data = {
            activeUser: activeUser,
            activeDriver: activeDriver,
            ordering: ordering,
            analysisData: analysisData
        };

        return res.send({ data: data });
    } catch( error ){
        console.log( error );
        return next( apiError.InternalServerError() );
    };
}

async function data( req, res, next ) {
    try{
        let result = await Analysis.findOne().sort({createdAt: -1});
        return res.send({ data: result });
    } catch( error ){
        console.log( error );
        return next( apiError.InternalServerError() );
    };
};

module.exports = exports = entry;