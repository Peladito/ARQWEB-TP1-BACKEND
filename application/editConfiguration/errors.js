class EditConfigurationError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "EC001"
        this.message = "EditConfiguration error"
        this.details = details
        Error.captureStackTrace(this, EditConfigurationError)
    }
}
class UnauthorizedUserError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "EC002"
        this.message = "UnauthorizedUser error"
        this.details = details
        Error.captureStackTrace(this, UnauthorizedUserError)
    }
}
class UnexistingUserError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "EC003"
        this.message = "Unexisting user error"
        this.details = details
        Error.captureStackTrace(this, UnexistingUserError)
    }
}
module.exports = {EditConfigurationError, UnauthorizedUserError, UnexistingUserError}