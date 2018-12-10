<<<<<<< HEAD
const User     = require('../user.model'),
      SocketId = require('../../socket/socket.model'),
      debug    = require('debug')('User'),
      errors   = require('../../errors'),
      apiError = require('server-api-errors'); 

const entry = async( req, res, next ) => {
    switch( req.query.type ){
        case 'active':
            return getActiveUserList( req, res, next );
        case 'all':
            return getAllUserList( req, res, next );
        default:
            return next( apiError.BadRequest( errors.MissingParameter("type")));
    };   
};

async function getActiveUserList( req, res, next ){
    let conditions = { type: req.query.user };

    try{
        let users = await SocketId
                                .find(conditions)
                                .populate([
                                    {
                                        path: "user",
                                        select:'-__v -salt -hash'
                                    }
                                ])
                                .select( 'user' );
        
        let data = [];

        users.map( item  => {
            data.push( item.user);
        });

        return res.send({ data: data });
    } catch( error ){
        console.log( error );
        return next( apiError.InternalServerError() );
    };
};


async function getAllUserList( req, res, next ){
    let conditions = { type: req.query.user };

    try{
        const users = await User
                                .find(conditions)
                                .select('-__v -salt -hash')
                                .lean();

        return res.send({ data: users});
    } catch( error ){
        console.log( error );
        return next( apiError.InternalServerError() );
    };
};

module.exports = exports = entry;

// async function list( req, res, next){
//     let condition = {};
//     if( req.query.userType )
//         condition={ }
//     const user = await
// }

// async function userList( req, res, next ){
//     let conditions = { type: 'user' };

//     if( req.query.type == "online"){
        // const users = await SocketId
        //                         .find(conditions)
        //                         .populate([
        //                             {
        //                                 path: "user",
        //                                 select:'-__v -salt -hash'
        //                             }
        //                         ])
        //                         .select( 'user' )
        //                         .lean();
        
                                
//     };
    
    // const users = await User
    //                         .find(conditions)
    //                         .select('-__v -salt -hash')
    //                         .lean();

    // console.log( users);
    
// }
=======
const User = require('../user.model'),
      Socket = require('../../socket/socket.model'),
      apiError = require('server-api-errors'),
      errors = require('../../errors'),
      debug = require('debug')('User');

module.exports = exports = async function list(req, res, next){
  
    const user = req.user;

    let users;

    switch ( user.type ){

        case "user":

            users = await Socket.find({ type: 'driver' }).populate('user').lean();
            return res.json({ data: users });
        
        case "driver":

            users = await Socket.find({ type: 'user' }).populate('user').lean();
            return res.json({ data: users });


        case "admin":
            return next(apiError.NotImplemented());

        default: 
            return next(apiError.BadRequest());

    };
    
};
>>>>>>> origin
