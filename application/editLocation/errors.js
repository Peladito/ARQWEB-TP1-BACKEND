class EditLocationError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "ELE001"
        this.message = "EditLocation error"
        this.details = details
        Error.captureStackTrace(this, EditLocationError)
    }
}
class UnauthorizedUserError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "ELE002"
        this.message = "UnauthorizedUser error"
        this.details = details
        Error.captureStackTrace(this, UnauthorizedUserError)
    }
}
class UnexistingUserError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "ELE003"
        this.message = "Unexisting user error"
        this.details = details
        Error.captureStackTrace(this, UnexistingUserError)
    }
}
class UnexistingLocationError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "ELE004"
        this.message = "UnexistingLocation error"
        this.details = details
        Error.captureStackTrace(this, UnexistingLocationError)
    }
}
module.exports = {EditLocationError,UnauthorizedUserError, UnexistingUserError, UnexistingLocationError}