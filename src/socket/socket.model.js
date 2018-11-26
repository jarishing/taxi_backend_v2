"use strict";

const mongoose = require("mongoose"),
      SocketIO = require('socket.io'),
      withinRange = require('../utils/withinRange');

let socketIo;

const socketSchema = new mongoose.Schema({
    socketId: { type: String, required: true },
    user : { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type : String,
    position: { lat: Number, lng: Number },
}, { timestamps: true });

socketSchema.statics.connect = function( server ){

    const _this = this;

    socketIo = SocketIO.listen( server );

    socketIo.on('connection', async function( socket ){

        const socketId = socket.id;
        
        let client = await _this.record(socketId);
        socket.emit('connection', client );

        socket.on('whatIsMe', client.whatIsMe );
        
        socket.on('renew_location', client.updateLocation );

        socket.on('disconnect', client.drop );

    });
};

socketSchema.statics.broadCastUser = async function( event, message ){
    const users = await this.find({ type: 'User'}).lean();
    for ( const user of users )
        if ( socketIo.sockets.connected[user.socketId] )
            socketIo.sockets.connected[user.socketId].emit( event, message );
};

socketSchema.statics.broadCastDriver = async function( event, message ){
    const users = await this.find({ type: 'Driver' }).lean();
    for ( const user of users )
        if ( socketIo.sockets.connected[user.socketId] )
            socketIo.sockets.connected[user.socketId].emit( event, message );
};

socketSchema.statics.broadCastDriverByDistance = async function( position, distance, event, message ){
    const users = await this.find({ type: 'Driver' }).lean();
    for ( const user of users )
        if ( withinRange( position, user.position, distance ))
            if ( socketIo.sockets.connected[user.socketId] )
                socketIo.sockets.connected[user.socketId].emit( event, message );
};

socketSchema.statics.record = async function( socketId ){
    let doc = new this({ socketId: socketId });
    doc = await doc.save();
    return doc;
};

socketSchema.methods.emitSocket = function( event, message ){
    if ( socketIo.sockets.connected[this.socketId] )
        socketIo.sockets.connected[this.socketId].emit( event, message );
};

socketSchema.methods.drop = async function(){
    await this.remove();
};

socketSchema.methods.updateLocation = async function( position ){
    this.position = position;
    await this.save();   
};

socketSchema.methods.whatIsMe = async function( doc ){
    this.user = doc.userId;
    this.type = doc.from;
    await this.save();   
};

const Socket = mongoose.model( "Socket", socketSchema );

module.exports = Socket;

Socket.find({}).remove().exec();