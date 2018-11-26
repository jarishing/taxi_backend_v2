"use strict";

const toRad = require('./toRad');

function withinRange( start, end, distance ){

    let radLat = toRad( end.lat ),radLng = toRad( end.lng );
    const itemLat = toRad(start.lat), itemLng = toRad(start.lng);

    const latDiff = radLat - itemLat, lngDiff = radLng - itemLng;

    let target_distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(latDiff/2),2) + Math.cos(radLat) * Math.cos(radTargetLat)*Math.pow(Math.sin(lngDiff/2),2)));
    target_distance = target_distance * 6378.137;
    target_distance = Math.round( distance * 10000 ) / 10000;

    return distance < target_distance;

};

module.exports = exports = withinRange;