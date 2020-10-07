
require('mongoose');
module.exports = (configuration)=>{
    require('./connection')(configuration.mongoose)
    const userModel = require('./model/user')
    const locationModel = require('./model/location')
    const checksModel = require('./model/check')
    const dals = require('./dal')
    return dals({userModel,locationModel,checksModel})
}