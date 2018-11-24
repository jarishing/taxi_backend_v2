"use strict";

const Place    = require('./place.model'),
      debug    = require('debug')('Place'),
      apiError = require('server-api-errors'),
      errors   = require('../errors'),
      costCal  = require('../utils/costCal'),
      Google   = require('../utils/googleService');

const find = async ( req, res, next ) => {

    const keyword = req.query.keyword;

    if ( keyword === undefined || keyword === "" )
        return next( new apiError.BadRequest( errors.MissingParameter("keyword")));

    let data = await Place.findOne({ keyword: keyword });

    if( data !== null )
        return res.send({ data: data.result });

    try{
        data = await Google.autocomplete( keyword );
        let result = [];

        for( const item of data){
            let location = {
                address     : item.description,
                location    : item.geometry.location,
                placeId     : item.place_id,
                description : item.description
            };
            result.push(location);
        };

        let newPlace = new Place({
            keyword : keyword,
            result  : result
        });

        newPlace = await newPlace.save();
        return res.json({ data: result });
    } catch( error ){
        console.error(error)
        return next( errors.InternalServerError() );
    }

};

