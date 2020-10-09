const { GetStatisticsError, UnexistingUserError, UnauthorizedUserError } = require("./errors");

exports.getStatistics = ({fetchUser,isAdmin,locationsCount,usersCount,infectedCount,possibleContagionCount}) => actor =>async ({}) => {
    try{
        let user = await fetchUser(actor)
        if(!user) throw new UnexistingUserError()
        if(! await isAdmin({user})) throw new UnauthorizedUserError()
        let nLocations = await locationsCount({})
        let nUsers = await usersCount({})
        let nInfections = await infectedCount({})
        let nRisks = await possibleContagionCount({})
        return {nLocations, nUsers, nInfections, nRisks}
    }catch(error){
        if(error instanceof UnexistingUserError || error instanceof UnauthorizedUserError) throw error
        throw new GetStatisticsError(error)
    }
    
}