class ListLocationsError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "LLE001"
        this.message = "ListLocations error"
        this.details = details
        Error.captureStackTrace(this, ListLocationsError)
    }
}
class UnexistingUserError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "LLE002"
        this.message = "Unexisting user error"
        this.details = details
        Error.captureStackTrace(this, UnexistingUserError)
    }
}
module.exports = {ListLocationsError, UnexistingUserError}