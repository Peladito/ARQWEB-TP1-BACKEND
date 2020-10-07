const { GetLocationError, UnexistingLocationError } = require("./errors");

exports.getLocation = ({fetchLocation}) => (unusedActor) => async ({id}) => {
    try{
        let flocation = await fetchLocation({id})
        if(!flocation) throw new UnexistingLocationError()
        return flocation
    }catch(error){
        if(error instanceof UnexistingLocationError) throw error
        throw new GetLocationError(error)
    }
    
}