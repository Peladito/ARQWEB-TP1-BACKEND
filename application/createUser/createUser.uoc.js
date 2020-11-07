const { CreateUserError, UserAlreadyExistsError } = require("./errors");

exports.createUser = ({userExists, persistUser}) => unusedActor => async ({email, password}) => {
    try{
        if(await userExists({email})) throw new UserAlreadyExistsError()
        await persistUser({email, password})
    }catch(error){
        if(error instanceof UserAlreadyExistsError) throw error
        throw new CreateUserError(error)
    }
    
}