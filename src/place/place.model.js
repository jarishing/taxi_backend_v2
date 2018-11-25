"use strict";

const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
    keyword : { type: String, required: true, unique: true },
    result  : { type: Object }
}, { timestamps: true });

placeSchema.statics.getAddress = async function( lat, lng ){

    let locationList = await this.findOne({ 'result.location.lat': lat, 'result.location.lng': lng });

    let address;

    locationList.result.forEach( (item) => {
        if( item.location.lat == lat && item.location.lng == lng )
            address = item.address;
    });

    address = address? address: locationList.result[0].address;

    return { address: address, lat: lat, lng: lng };
};

const Place = mongoose.model( "Place", placeSchema );

module.exports = Place;