const mongoose = require('mongoose');

var ConfigurationSchema = new mongoose.Schema({
    name:{
        type: String,
        unique: true
    },
    daysToBeCured: Number,
    minutesForContagionByContact: Number
    
},{timestamps:{}})

module.exports = mongoose.model('configuration', ConfigurationSchema)
