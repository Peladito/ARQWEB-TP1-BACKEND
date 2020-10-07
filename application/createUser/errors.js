class CreateUserError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "CUE001"
        this.message = "CreateUser error"
        this.details = details
        Error.captureStackTrace(this, CreateUserError)
    }
}

class UserAlreadyExistsError extends Error {
    constructor(details, ...args) {
        super(...args)
        this.code = "CUE002"
        this.message = "User already exists"
        this.details = details
        Error.captureStackTrace(this, UserAlreadyExistsError)
    }
}

module.exports = {CreateUserError, UserAlreadyExistsError}