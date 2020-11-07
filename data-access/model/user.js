const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true
    },
    password: String,
    isAdmin:{
        type:Boolean
    }
},{timestamps:{}})

module.exports = mongoose.model('user', UserSchema)
