
const userExists = ({userModel}) => async ({email}) => {
    let count = await userModel.countDocuments({email})
    return count > 0
 }
 const persistUser = ({userModel}) => async ({email}) => {
    let u = new userModel({email})
    await u.save()
    return u
 }
 const deleteAll = ({userModel}) => async () => {
     await  userModel.deleteMany({})
    return true
 }
 module.exports = (dependencies) => {
    return {
        userExists: userExists(dependencies),
        persistUser: persistUser(dependencies),
        deleteAll: deleteAll(dependencies)
    }
}