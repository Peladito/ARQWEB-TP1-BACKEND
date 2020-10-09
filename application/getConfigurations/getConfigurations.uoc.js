const { GetConfigurationsError, UnauthorizedUserError, UnexistingUserError } = require("./errors");

exports.getConfigurations = ({fetchUser, isAdmin, fetchConfigurations}) => actor => async ({}) => {
    try{
        let user = await fetchUser(actor)
        if(!user) throw new UnexistingUserError()
        if(!await isAdmin({user})) throw new UnauthorizedUserError()
        return await fetchConfigurations({})
    }catch(error){
        if(error instanceof UnexistingUserError || error instanceof UnauthorizedUserError) throw error
        throw new GetConfigurationsError(error)
    }
    
}