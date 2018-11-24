const mongoose = require("mongoose"),
      crypto   = require("crypto"),
      jwt      = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    email           : { type: String },
    name            : { type: String, required: true },
    hash            : String,
    salt            : String,
}, { timestamps: true, strict: false });

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, process.env.DIGEST_NAME).toString('hex');
};

userSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, process.env.DIGEST_NAME).toString("hex");
    return this.hash == hash;
};

userSchema.methods.generateJwt = function () {
    return jwt.sign(this, process.env.SECRET_KEY);
};

const User = mongoose.model("User", userSchema);

module.exports = User;

