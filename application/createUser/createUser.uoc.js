const { CreateUserError, UserAlreadyExistsError } = require("./errors");

exports.createUser = ({userExists, persistUser}) => (unusedActor) => async (user) => {
    try{
        if(await userExists(user)) throw new UserAlreadyExistsError()
        await persistUser(user)
    }catch(error){
        if(error instanceof UserAlreadyExistsError) throw error
        throw new CreateUserError(error)
    }
    
}