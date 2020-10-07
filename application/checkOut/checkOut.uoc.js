const { CheckOutError, UnexistingUserError, CheckOutNotAllowedError } = require("./errors");

exports.checkOut = ({fetchUser, checkoutAllowed, checkout}) => actor => async ({}) => {
    try{
        let user = await fetchUser(actor)
        if(!user) throw new UnexistingUserError()
        let allowed = await checkoutAllowed({user})
        if(!allowed) throw new CheckOutNotAllowedError()
        await checkout(user)
    }catch(error){
        if([UnexistingUserError, CheckOutNotAllowedError].find(errorClass => error instanceof errorClass)) throw error
        throw new CheckOutError(error)
    }
    
}