
const errorMapper = {
    UserAlreadyExistsError: 409,
    LocationAlreadyExistsError: 409,
    UnexistingUserError: 403,
    UnauthorizedUserError: 403,
    UnexistingLocationError: 404,
    CheckOutNotAllowedError: 409
}

exports.present = function(error){
    let status = errorMapper[error.constructor.name] || error.status || 500   
    return {status, data:error}
    
}