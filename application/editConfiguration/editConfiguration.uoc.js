const { EditConfigurationError, UnauthorizedUserError, UnexistingUserError } = require("./errors");

exports.editConfiguration = ({fetchUser, isAdmin, persistConfigurations}) => actor => async ({minutesForContagionByContact, daysToBeCured}) => {
    try{
        let user = await fetchUser(actor)
        if(!user) throw new UnexistingUserError()
        if(!await isAdmin({user})) throw new UnauthorizedUserError()
        return await persistConfigurations({minutesForContagionByContact, daysToBeCured})
    }catch(error){
        if(error instanceof UnexistingUserError || error instanceof UnauthorizedUserError) throw error
        throw new EditConfigurationError(error)
    }
    
}