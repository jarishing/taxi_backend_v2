"use strict";

const toRad = require('./toRad');

function withinRange( origin, range, positions ){

    let radLat = toRad( origin.lat ),radLng = toRad( origin.lng ), result = [];

    for ( const position of positions ){

        const itemLat = toRad(position.lat), itemLng = toRad(position.lng);

        const latDiff = radLat - itemLat,
              lngDiff = radLng - itemLng;

        let distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(latDiff/2),2) + Math.cos(radLat) * Math.cos(radTargetLat)*Math.pow(Math.sin(lngDiff/2),2)));
        distance = distance * 6378.137;
        distance = Math.round( distance * 10000 ) / 10000;

        if( distance < range )
            result.push( item );
    };

    return result;
};

module.exports = exports = withinRange;