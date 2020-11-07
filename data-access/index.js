
require('mongoose');
module.exports = (configuration)=>{
    require('./connection')(configuration.mongoose)
    const userModel = require('./model/user')
    const locationModel = require('./model/location')
    const checksModel = require('./model/check')
    const diagnosticModel = require('./model/diagnostic')
    const configurationModel = require('./model/configuration')
    const notificationService = require('./services/notification')(configuration)
    const dals = require('./dal')
    const bcrypt = require('bcrypt');
    const stringHasher = stringToEncrypt =>  bcrypt.hashSync(stringToEncrypt, 10);
    const hashComparer = bcrypt.compareSync
    return dals({userModel,locationModel,checksModel,diagnosticModel,configurationModel, notificationService, stringHasher, hashComparer})
}