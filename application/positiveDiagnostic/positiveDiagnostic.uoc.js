const { PositiveDiagnosticError, UnexistingUserError } = require("./errors");

exports.positiveDiagnostic = ({fetchUser, persistDiagnostic}) => actor =>async ({}) => {
    try{
        let user = await fetchUser(actor)
        if(!user) throw new UnexistingUserError()
        await persistDiagnostic({status:'positive', user})
    }catch(error){
        if(error instanceof UnexistingUserError) throw error
        throw new PositiveDiagnosticError(error)
    }
    
}