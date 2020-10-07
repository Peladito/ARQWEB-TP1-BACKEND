class CreateLocationError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "CLE001"
        this.message = "CreateLocation error"
        this.details = details
        Error.captureStackTrace(this, CreateLocationError)
    }
}
class LocationAlreadyExistsError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "CLE002"
        this.message = "Location already exists error"
        this.details = details
        Error.captureStackTrace(this, LocationAlreadyExistsError)
    }
}
class UnexistingUserError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "CLE003"
        this.message = "Unexisting user error"
        this.details = details
        Error.captureStackTrace(this, UnexistingUserError)
    }
}
module.exports = {CreateLocationError, LocationAlreadyExistsError, UnexistingUserError}

