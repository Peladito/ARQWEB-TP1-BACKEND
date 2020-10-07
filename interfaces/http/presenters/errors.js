
const errorMapper = {
    UserAlreadyExistsError: 409
}

exports.present = function(error){
    let status = errorMapper[error.constructor.name] || error.status || 500   
    return {status, data:error}
    
}