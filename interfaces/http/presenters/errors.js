
const errorMapper = {
    UnauthorizedError: 401,
    UnhandledError: 500,
    WrongParametersError: 400,
    CancelRefundError: 409,
    CreateMerchant: 409,
    CreatePayment: 409
}

exports.present = function(error){
    let status = errorMapper[error.constructor.name] || error.status || 500   
    return {status, data:error}
    
}