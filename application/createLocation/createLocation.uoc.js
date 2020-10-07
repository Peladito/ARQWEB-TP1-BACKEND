const { CreateLocationError, LocationAlreadyExistsError, UnexistingUserError } = require("./errors");

exports.createLocation = ({locationExists, persistLocation, fetchUser}) => actor => async (location) => {
    try{
        let owner = await fetchUser(actor)
        if(!owner) throw new UnexistingUserError() 
        if(await locationExists(location)) throw new LocationAlreadyExistsError()
        location.owner = owner
        return await persistLocation(location)
    }catch(error){
        if(error instanceof LocationAlreadyExistsError || error instanceof UnexistingUserError) throw error
        throw new CreateLocationError(error)
    }
    
}