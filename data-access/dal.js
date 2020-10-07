
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
 const deleteAll = ({userModel, locationModel}) => async () => {
     await  userModel.deleteMany({})
     await  locationModel.deleteMany({})
    return true
 }

 const fetchLocation = ({locationModel}) => async (location) => {
     return await locationModel.findOne(location)
 }
 module.exports = (dependencies) => {
    return {
        userExists: userExists(dependencies),
        fetchUser: fetchUser(dependencies),
        persistUser: persistUser(dependencies),
        deleteAll: deleteAll(dependencies),
        locationExists: locationExists(dependencies),
        persistLocation: persistLocation(dependencies),
        fetchLocation: fetchLocation(dependencies)

    }
}