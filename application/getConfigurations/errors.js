class GetConfigurationsError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "GC001"
        this.message = "GetConfigurations error"
        this.details = details
        Error.captureStackTrace(this, GetConfigurationsError)
    }
}
class UnauthorizedUserError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "GC002"
        this.message = "UnauthorizedUser error"
        this.details = details
        Error.captureStackTrace(this, UnauthorizedUserError)
    }
}
class UnexistingUserError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "GC003"
        this.message = "Unexisting user error"
        this.details = details
        Error.captureStackTrace(this, UnexistingUserError)
    }
}
module.exports = {GetConfigurationsError, UnauthorizedUserError, UnexistingUserError}