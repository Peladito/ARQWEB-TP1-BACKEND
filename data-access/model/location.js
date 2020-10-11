const mongoose = require('mongoose');

var LocationSchema = new mongoose.Schema({
    name:{
        type: String,
        unique: true
    },
    description: String,
    address: String,
    position: {
        type: { type: String, default: 'Point' },
        coordinates: []
    },
    maxCapacity: Number,
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    images: []
    
},{timestamps:{}})

module.exports = mongoose.model('location', LocationSchema)
