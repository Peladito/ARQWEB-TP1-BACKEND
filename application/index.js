const createUser = require('./createUser')
const createLocation = require('./createLocation')
const getLocation = require('./getLocation')
const editLocation = require('./editLocation')
module.exports = dependencies => ({
    createUserUOC: createUser(dependencies),
    createLocationUOC: createLocation(dependencies),
    getLocationUOC: getLocation(dependencies),
    editLocationUOC: editLocation(dependencies)
})