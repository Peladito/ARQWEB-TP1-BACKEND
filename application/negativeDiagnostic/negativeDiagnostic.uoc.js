const { NegativeDiagnosticError, UnexistingUserError } = require("./errors");

exports.negativeDiagnostic = ({fetchUser, persistDiagnostic}) => actor =>async ({date}) => {
    try{
        if(isNaN(date)) throw "Invalid timestamp"
        date = date?new Date(Number(date)):new Date()
        let user = await fetchUser(actor)
        if(!user) throw new UnexistingUserError()
        await persistDiagnostic({status:'negative', user, date})
    }catch(error){
        if(error instanceof UnexistingUserError) throw error
        throw new NegativeDiagnosticError(error)
    }
    
}