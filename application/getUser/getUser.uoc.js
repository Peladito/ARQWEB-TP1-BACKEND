const { GetUserError , UnexistingUserError} = require("./errors");

exports.getUser = ({fetchUser, checkoutAllowed, isInfected, isPossiblyInfected}) => actor => async ({}) => {
    try{
        let user = await fetchUser(actor)
        if(!user) throw new UnexistingUserError()
        let isCheckedIn = await checkoutAllowed({user})
        let infected = await isInfected({user})
        let possiblyInfected = await isPossiblyInfected({user})
        return {email: user.email, isCheckedIn, isInfected: infected, possiblyInfected}
    }catch(error){
        if(error instanceof UnexistingUserError) throw error
        throw new GetUserError(error)
    }
    
}