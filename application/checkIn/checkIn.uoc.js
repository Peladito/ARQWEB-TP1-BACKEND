const { CheckInError, CheckinNotAllowedError, UnexistingUserError, UnexistingLocationError } = require("./errors");

exports.checkIn = ({fetchUser, fetchLocation, checkinAllowed, checkIn}) => actor => async ({id}) => {
    try{
        let user = await fetchUser(actor)
        if(!user) throw new UnexistingUserError()
        let thelocation = await fetchLocation({id})
        if(!thelocation) throw new UnexistingLocationError()
        let allowed = await checkinAllowed({user})
        if(!allowed) throw new CheckinNotAllowedError()
        await checkIn({user, location: thelocation})
    }catch(error){
        if([UnexistingUserError, UnexistingLocationError, CheckinNotAllowedError].find(errorClass => error instanceof errorClass)) throw error
        throw new CheckInError(error)
    }
    
}