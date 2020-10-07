const createUser = require('./createUser')
const createLocation = require('./createLocation')
module.exports = dependencies => ({
    createUserUOC: createUser(dependencies),
    createLocationUOC: createLocation(dependencies)
})