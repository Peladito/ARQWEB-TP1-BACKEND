const createUser = require('./createUser')
module.exports = dependencies => ({createUserUOC: createUser(dependencies)})