const createUser = require('./createUser')
const createLocation = require('./createLocation')
const getLocation = require('./getLocation')
const editLocation = require('./editLocation')
const checkIn = require('./checkIn')
const checkOut = require('./checkOut')
const positiveDiagnostic = require('./positiveDiagnostic')
const negativeDiagnostic = require('./negativeDiagnostic')
const getUser = require('./getUser')
const listLocations = require('./listLocations')
const getStatistics = require('./getStatistics')
const getConfigurations = require('./getConfigurations')
const editConfiguration = require('./editConfiguration')
const sendNotifications = require('./sendNotifications')
module.exports = dependencies => ({
    createUserUOC: createUser(dependencies),
    createLocationUOC: createLocation(dependencies),
    getLocationUOC: getLocation(dependencies),
    editLocationUOC: editLocation(dependencies),
    checkInUOC: checkIn(dependencies),
    checkOutUOC: checkOut(dependencies),
    positiveDiagnosticUOC: positiveDiagnostic(dependencies),
    negativeDiagnosticUOC: negativeDiagnostic(dependencies),
    getUserUOC: getUser(dependencies),
    listLocationsUOC: listLocations(dependencies),
    getStatisticsUOC: getStatistics(dependencies),
    getConfigurationsUOC: getConfigurations(dependencies),
    editConfigurationUOC: editConfiguration(dependencies),
    sendNotificationsUOC: sendNotifications(dependencies)
})