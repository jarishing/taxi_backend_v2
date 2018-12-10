const User     = require('../user.model'),
      debug    = require('debug')('User'),
      ApiError = require('server-api-errors'); 

async function update(req, res, next) {
    
    const { telephone_no, vehicle_reg_no } = req.body;

    let user = req.userDoc;

    const updates = {};

    if (vehicle_reg_no)
        updates.vehicle_reg_no = vehicle_reg_no;

    if ( telephone_no )
        updates.telephone_no = telephone_no;

    try {
        user = await User.findByIdAndUpdate(user._id, updates, {new: true});
        return res.send({ data:user  })
    } catch( error ){
        console.log(error);
        return next(ApiError.BadRequest());
    }

}

module.exports = exports = update;