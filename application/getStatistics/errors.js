class GetStatisticsError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "GS001"
        this.message = "GetStatistics error"
        this.details = details
        Error.captureStackTrace(this, GetStatisticsError)
    }
}
class UnexistingUserError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "GS002"
        this.message = "Unexisting user error"
        this.details = details
        Error.captureStackTrace(this, UnexistingUserError)
    }
}
class UnauthorizedUserError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "GS002"
        this.message = "UnauthorizedUser error"
        this.details = details
        Error.captureStackTrace(this, UnauthorizedUserError)
    }
}
module.exports = {GetStatisticsError, UnexistingUserError, UnauthorizedUserError}