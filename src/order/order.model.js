"use strict";

const mongoose = require("mongoose"),
      Schema   = mongoose.Schema;

const orderSchema = new mongoose.Schema({

    start: { type: Schema.Types.Mixed, required: true },
    end: { type: Schema.Types.Mixed, required: true },
    route: { type: Schema.Types.Mixed },
    criteria: { type: Schema.Types.Mixed, required: true },

    status: { 
        type: String, 
        default: 'new',
        enum: [ 'new', 'accepted', 'canceled', 'commented', 'badOrder' ]
    },
    
    orderBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    acceptBy: { type: Schema.Types.ObjectId, ref: "Driver" }
}, { timestamps: true });

orderSchema.statics.create = function( orderDoc ){
    doc = new this(orderDoc);
    return doc.save();
};

orderSchema.statics.get = function( conditions ){
    return this
                .find(conditions)
                .populate('orderBy acceptBy')
                .lean();
};

const Order = mongoose.model("Order", orderSchema );

module.exports = Order;