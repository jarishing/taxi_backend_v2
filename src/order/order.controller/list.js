const Order    = require('../order.model'),
      User     = require('../../user/user.model'),
      SocketModel = require('../../socket/socket.model'),
      debug    = require('debug')('Order'),
      apiError = require('server-api-errors'),
      withinRange = require('../../utils/withinRange'),
      errors   = require('../../errors');

async function getOrders( req, res, next ){

    let condition = {};
    switch(req.query.status){

        case 'accepted':
            condition.status = req.query.status;
            if ( req.user.type == 'user' )
                condition.orderBy = req.user._id;
            else if ( req.user.type == 'driver' )
                condition.acceptBy = req.user._id;
            else if ( req.user.type == 'admin' );
            else    
                return next( apiError.BadRequest());
            break;

        case 'commented':
            condition.status = req.query.status;
            if ( req.user.type == 'user' ){
                condition.orderBy = req.user._id;
                break;
            } else if ( req.user.type == 'admin' ){
                break;
            }else
                return next( apiError.BadRequest());
               
        case 'new':
            if( req.user.type == 'driver' ){
                return driverGetNewOrder( req, res, next );
                // position = await SocketModel.findOne({user: req.user._id});
                // position = position.position;
                // condition = { $and:[ { status: 'new' }, { orderBy: { $ne: req.user._id }}] };
            }else if( req.user.type == 'user' ){
                condition.orderBy = req.user._id;
                condition.status = 'new';
            }
            else if( req.user.type == 'admin' )
                condition.status = 'new';
            else
                return next( apiError.BadRequest());
            break;
        case 'canceled':
        case 'badOrder':
            condition.status = req.query.status;
            if( req.user.type == 'admin' )
                break;
            else
                return next( apiError.BadRequest());
        case 'all':
            if( req.user.type == 'admin' )
                break;
            else
                return next( apiError.BadRequest());
        default:
            return next( apiError.BadRequest());
    };

    try {
        let orders = await Order
                                .find(condition)
                                .populate('orderBy acceptBy')
                                .lean();

        return res.json({ data: orders, count: orders.length });
    } catch( error ){
        console.error(error)
        return next( apiError.InternalServerError() );
    };

};

async function driverGetNewOrder( req, res, next ){
    let socket = await SocketModel.findOne({user: req.user._id});
        // driver = User.findById( req.user._id );

    // [ socket, driver ] = await Promise.all([ position, driver ]);

    if( socket )
        position = socket.position;
    
    const condition = { $and:[ { status: 'new' }, { orderBy: { $ne: req.user._id }}] };
    // let time = new Date();

    // switch( driver.grade ){
    //     case 'A':
    //         break;
    //     case 'B':
    //         time.setSeconds(time.getSeconds()-10);
    //         condition.$and.push( { createdAt: { $lte: time} } );
    //         break;
    //     case 'C':
    //         time.setSeconds(time.getSeconds()-30);
    //         condition.$and.push( { createdAt: { $lte: time} } );
    //         break;
    //     case 'D':
    //         time.setMinutes(time.getMinutes()-1);
    //         condition.$and.push( { createdAt: { $lte: time} } );
    //         break;
    //     case 'E':
    //         time.setMinutes(time.getMinutes()-2);
    //         condition.$and.push( { createdAt: { $lte: time} } );
    //         break;
    //     default:
    //         return next( apiError.BadRequest( errors.ValidationError('Invalid page type', 'driver grade')));
    // };

    try{
        let orders = await Order
                                    .find(condition)
                                    .populate('orderBy acceptBy')
                                    .sort({createdAt: 1})
                                    .limit(30)
                                    .lean();

        if( socket ){
            orders = orders.filter( item =>
                withinRange( 
                    {lat: item.start.lat, lng: item.start.lng },
                    position, 3
                )
            );
        };

        return res.json({ data: orders, count: orders.length });

    } catch( error ){
        console.error(error)
        return next( apiError.InternalServerError() );
    };

    // switch( driver.grade ){
    //     case 'A':
    //         return;
    //     case 'B':
    //         time.setSeconds(time.getSeconds()-10);
    //         condition.$and.push( { createdAt: { $lte: time} } );
    //         break;
    //     case 'C':
    //         time.setSeconds(time.getSeconds()-30);
    //         condition.$and.push( { createdAt: { $lte: time} } );
    //         break;
    //     case 'D':
    //         time.setMinutes(time.getMinutes()-1);
    //         condition.$and.push( { createdAt: { $lte: time} } );
    //         break;
    //     case 'E':
    //         time.setMinutes(time.getMinutes()-2);
    //         condition.$and.push( { createdAt: { $lte: time} } );
    //         break;
    //     default:
    //         return next( apiError.BadRequest( errors.ValidationError('Invalid page type', 'driver grade')));
    // };


}

module.exports = exports = getOrders;