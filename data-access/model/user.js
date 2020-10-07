const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true
    }
},{timestamps:{}})

module.exports = mongoose.model('user', UserSchema)
