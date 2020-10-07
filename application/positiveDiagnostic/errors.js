class PositiveDiagnosticError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "PDE001"
        this.message = "PositiveDiagnostic error"
        this.details = details
        Error.captureStackTrace(this, PositiveDiagnosticError)
    }
}
class UnexistingUserError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "PDE002"
        this.message = "UnexistingUserError error"
        this.details = details
        Error.captureStackTrace(this, UnexistingUserError)
    }
}
module.exports = {PositiveDiagnosticError, UnexistingUserError}