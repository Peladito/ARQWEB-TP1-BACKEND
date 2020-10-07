
const userExists = ({userModel}) => async ({email}) => {
    let count = await userModel.countDocuments({email})
    return count > 0
 }
 const persistUser = ({userModel}) => async ({email}) => {
    let u = new userModel({email})
    await u.save()
    return u
 }
 const locationExists = ({locationModel}) => async ({email}) => {
    let count = await locationModel.countDocuments({email})
    return count > 0
 }
 const persistLocation = ({locationModel}) => async ({maxCapacity, name, description, latitude, longitude, address, owner}) => {
    let l = new locationModel({maxCapacity, name, description, latitude, longitude, address, owner})
    l.position.coordinates =  [longitude, latitude]
    await l.save()
    return l
 }
 const fetchUser = ({userModel}) => async ({email}) => {
    return await userModel.findOne({email})

 }
 const deleteAll = ({userModel, locationModel, checksModel}) => async () => {
     await  userModel.deleteMany({})
     await  locationModel.deleteMany({})
     await  checksModel.deleteMany({})
    return true
 }

 const fetchLocation = ({locationModel}) => async (location) => {
    if(location.id){
       location._id = location.id
       delete location.id
    }
     return await locationModel.findOne(location)
 }
 const updateLocation = ({locationModel}) => async ({location, locationData}) => {
    delete locationData._id
    Object.assign(location, locationData)
   return await locationModel.updateOne({_id:location.id},{$set:location})
}
const isLocationOwner = ({}) => async ({location, user}) => {
   return location.owner.toString() === user.id
}
const checkIn = ({checksModel}) => async ({location, user}) => {
   let c = new checksModel({location, user, checkin:new Date()})
    await c.save()
    return c
}
const checkinAllowed = ({checksModel}) => async ({user}) => {
    return 0 === await checksModel.count({user: user.id, checkout: null})
}
 module.exports = (dependencies) => {
    return {
        userExists: userExists(dependencies),
        fetchUser: fetchUser(dependencies),
        persistUser: persistUser(dependencies),
        deleteAll: deleteAll(dependencies),
        locationExists: locationExists(dependencies),
        persistLocation: persistLocation(dependencies),
        fetchLocation: fetchLocation(dependencies),
        updateLocation: updateLocation(dependencies),
        isLocationOwner: isLocationOwner(dependencies),
        checkIn: checkIn(dependencies),
        checkinAllowed: checkinAllowed(dependencies)

    }
}