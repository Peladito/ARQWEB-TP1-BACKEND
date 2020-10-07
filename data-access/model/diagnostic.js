const mongoose = require('mongoose');

var DiagnosticSchema = new mongoose.Schema({
    status:{
        type: String
    },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    
},{timestamps:{}})

module.exports = mongoose.model('diagnostic', DiagnosticSchema)
