const { EditLocationError, UnauthorizedUserError, UnexistingUserError, UnexistingLocationError } = require("./errors");

exports.editLocation = ({fetchUser, fetchLocation, isLocationOwner, updateLocation}) => actor => async (locationData) => {
    try{
        let user = await fetchUser(actor)
        let location = await fetchLocation({id:locationData.id})
        if(!user) throw new UnexistingUserError()
        if(!location) throw new UnexistingLocationError()
        if(!await isLocationOwner({location, user})) throw new UnauthorizedUserError()
        await updateLocation({location, locationData})
        
        return await fetchLocation({id:locationData.id})
    }catch(error){
        if(error instanceof UnexistingUserError ||error instanceof UnexistingLocationError||error instanceof UnauthorizedUserError ) throw error
        throw new EditLocationError(error)
    }
    
}