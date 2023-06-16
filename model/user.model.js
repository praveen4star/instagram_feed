// const { model }   = require('mongoose');

const {db} = require('../config/db.connection');

const UserSchema = new db.Schema(
    {
        username: { type: String, required: true, unique: true, minlenght : 1 },
        // password: { type: String, required: true , minlength : 1},
        fullname: { type: String, required: true , minlength : 1},
    },
    {
        timestamps: true,
    }
);
const users = db.model("User", UserSchema);

module.exports = users;