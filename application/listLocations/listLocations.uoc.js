const { ListLocationsError, UnexistingUserError } = require("./errors");

exports.listLocations = ({isAdmin, fetchAllLocations, fetchUser, fetchOwnedLocations}) => actor => async ({}) => {
    try{
        let locations = []
        let user = await fetchUser(actor)
        if(!user) throw new UnexistingUserError
        if(await isAdmin({user})){
            locations = await fetchAllLocations({})
        }else{
            locations = await fetchOwnedLocations({user})
        }
        return locations
    }catch(error){
        if(error instanceof UnexistingUserError) throw error
        throw new ListLocationsError(error)
    }
    
}