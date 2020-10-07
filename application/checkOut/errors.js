class CheckOutError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "COE001"
        this.message = "CheckOut error"
        this.details = details
        Error.captureStackTrace(this, CheckOutError)
    }
}

class CheckOutNotAllowedError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "COE002"
        this.message = "CheckOutNotAllowed error"
        this.details = details
        Error.captureStackTrace(this, CheckOutNotAllowedError)
    }
}

class UnexistingUserError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "COE003"
        this.message = "UnexistingUser error"
        this.details = details
        Error.captureStackTrace(this, UnexistingUserError)
    }
}
module.exports = {CheckOutError, CheckOutNotAllowedError, UnexistingUserError}