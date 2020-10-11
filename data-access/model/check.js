const mongoose = require('mongoose');

var ChecksSchema = new mongoose.Schema({
    checkin: Date,
    checkout: Date,
    location:{type: mongoose.Schema.Types.ObjectId, ref: 'location'},
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    possibleInfection: {
        type: Boolean,
        default: false
    },
    notified: {
        type: Boolean,
        default: false
    },
},{timestamps:{}})

module.exports = mongoose.model('checks', ChecksSchema)
