class GetUserError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "GUE001"
        this.message = "GetUser error"
        this.details = details
        Error.captureStackTrace(this, GetUserError)
    }
}
class UnexistingUserError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "GUE002"
        this.message = "Unexisting user error"
        this.details = details
        Error.captureStackTrace(this, UnexistingUserError)
    }
}
module.exports = {GetUserError, UnexistingUserError}