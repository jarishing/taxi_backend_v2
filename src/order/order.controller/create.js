const Order    = require('../order.model'),
      Place    = require('../../place/place.model'),
      debug    = require('debug')('Order'),
      apiError = require('server-api-errors'),
      errors   = require('../../errors'),
      costCal  = require('../../utils/costCal'),
      Socket   = require('../../socket/socket.model.js');

async function createOrder( req, res, next ){

    let { origin, destination, route, criteria } = req.body;

    if( criteria.taxiType != "red" && criteria.taxiType != "green")
        return next( apiError.BadRequest( errors.ValidationError("Taxi Type should be red or green", 'taxiType')));
    
    if( criteria.passenger != 4 && criteria.passenger != 5)
        return next( apiError.BadRequest( errors.ValidationError("Invalid passenger number", 'passenger')));

    if( criteria.tunnel != "any" && criteria.tunnel != "HungHomTunnel" && criteria.tunnel != "eastTunnel" && criteria.tunnel != "westTunnel" )
        return next( apiError.BadRequest( errors.ValidationError("Invalid tunnel type", 'tunnel')));

    switch( criteria.routeStop ){
        case 0:
            break;
        case 1:
            if(!route.route1)
                return next( apiError.BadRequest() );
            route.route1 = await Place.getAddress( route.route1.lat, route.route1.lng );
            break;
        case 2:
            if(!route.route1)
                return next( apiError.BadRequest() );
            if(!route.route2)
                return next( apiError.BadRequest() );
            [ route.route1, route.route2 ] = await Promise.all([ Place.getAddress( route.route1.lat, route.route1.lng ), Place.getAddress( route.route2.lat, route.route2.lng ) ]);
            break;
        case 3:
            if(!route.route1)
                return next( apiError.BadRequest() );
            if(!route.route2)
                return next( apiError.BadRequest() );
            if(!route.route3)
                return next( apiError.BadRequest() );
            [ route.route1, route.route2, route.route3 ] = await Promise.all([ Place.getAddress( route.route1.lat, route.route1.lng ), Place.getAddress( route.route2.lat, route.route2.lng ), Place.getAddress( route.route3.lat, route.route3.lng ) ]);
            break;
    };

    let route1, route2, route3;

    if( route ){
        route1 = route.route1? route.route1:null;
        route2 = route.route2? route.route2:null;
        route3 = route.route3? route.route3:null;
    };

    try {
        let data = costCal( origin, destination, route1, route2, route3, criteria.taxiType,  criteria.tunnel, criteria.discount );
        origin = Place.getAddress( origin.lat, origin.lng );
        destination = Place.getAddress( destination.lat, destination.lng );

        [ data, origin, destination ] = await Promise.all([ data, origin, destination ]);

        criteria['cost'] = data.cost;
        criteria['time'] = data.time;
        criteria['distance'] = data.distance;

        let order = await Order.create({
            start    : origin,
            end      : destination,
            route    : route,
            criteria : criteria,
            orderBy  : req.user._id  
        });

        Socket.broadCastDriver('action', Socket.type.NEW_ORDER );

        return res.send({ data: order });
    } catch( error ){
        console.error(error)
        return next( apiError.InternalServerError() );
    };

};

module.exports = exports = createOrder;