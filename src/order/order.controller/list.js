const Order    = require('../order.model'),
      SocketModel = require('../../socket/socket.model'),
      debug    = require('debug')('Order'),
      apiError = require('server-api-errors'),
      withinRange = require('../../utils/withinRange'),
      errors   = require('../../errors');

async function getOrders( req, res, next ){

    const condition = {};
    let position;

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
            if ( req.user.type == 'user' ){
                condition.status = req.query.status;
                condition.orderBy = req.user._id;
                break;
            } else if ( req.user.type == 'admin' ){
                condition.status = req.query.status;
                break;
            }else
                return next( apiError.BadRequest());
               
        case 'new':
            condition.status = 'new';
            if( req.user.type == 'driver' ){
                position = await SocketModel.findOne({user: req.user._id});
                position = position.position;
            }else if( req.user.type == 'user' )
                condition.orderBy = req.user._id;
            else if( req.user.type == 'admin' );
            else
                return next( apiError.BadRequest());
            // if( req.user.type !== 'driver' )
            //     return next( apiError.BadRequest());
            // position = await SocketModel.findOne({user: req.user._id});
            // position = position.position;
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
        // console.log('hello');
        let orders = await Order
                                .find(condition)
                                .populate('orderBy acceptBy')
                                .lean();
        
                
        //filter
        if( req.user.type == 'driver' && condition.status == 'new' && orders ){
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

};

module.exports = exports = getOrders;