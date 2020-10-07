class CheckInError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "CIE001"
        this.message = "CheckIn error"
        this.details = details
        Error.captureStackTrace(this, CheckInError)
    }
}
class CheckinNotAllowedError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "CIE002"
        this.message = "CheckinNotAllowed error"
        this.details = details
        Error.captureStackTrace(this, CheckinNotAllowedError)
    }
}

class UnexistingUserError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "CIE003"
        this.message = "UnexistingUser error"
        this.details = details
        Error.captureStackTrace(this, UnexistingUserError)
    }
}

class UnexistingLocationError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "CIE004"
        this.message = "UnexistingLocation error"
        this.details = details
        Error.captureStackTrace(this, UnexistingLocationError)
    }
}
module.exports = {CheckInError, CheckinNotAllowedError, UnexistingUserError, UnexistingLocationError}