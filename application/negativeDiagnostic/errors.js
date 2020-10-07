class NegativeDiagnosticError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "NDE001"
        this.message = "NegativeDiagnostic error"
        this.details = details
        Error.captureStackTrace(this, NegativeDiagnosticError)
    }
}
class UnexistingUserError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "NDE002"
        this.message = "UnexistingUserError error"
        this.details = details
        Error.captureStackTrace(this, UnexistingUserError)
    }
}
module.exports = {NegativeDiagnosticError, UnexistingUserError}