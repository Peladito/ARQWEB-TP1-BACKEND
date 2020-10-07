class GetLocationError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "GLE001"
        this.message = "GetLocation error"
        this.details = details
        Error.captureStackTrace(this, GetLocationError)
    }
}
class UnexistingLocationError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "GLE002"
        this.message = "UnexistingLocation error"
        this.details = details
        Error.captureStackTrace(this, UnexistingLocationError)
    }
}

module.exports = {GetLocationError, UnexistingLocationError}