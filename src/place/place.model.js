"use strict";

const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
    keyword : { type: String, required: true, unique: true },
    result  : { type: Object }
}, { timestamps: true });

const Place = mongoose.model( "Place", placeSchema );

module.exports = Place;