require('dotenv').config()
require('mongoose');
const config = require('../../../config')
const {persistUser, userExists, deleteAll, fetchUser, persistLocation, fetchLocation, updateLocation, checkIn, checkinAllowed, checkoutAllowed, persistDiagnostic, isInfected, isPossiblyInfected, checkout} = require('../../../data-access')(config)


describe("Data access", () => {
    const user = {
        email: 'fake@mail.com'
    }
    beforeEach(async () => {
        await deleteAll()
    })
    test("should allow to persist an user", async () => {
        
        await persistUser(user)
        
    });
    test("should say if an user exists", async () => {
        await persistUser(user)
        let res = await userExists(user)
        let res2 = await userExists({email:'unexistingemail'})
        expect(res).toBe(true)
        expect(res2).toBe(false)
        
    });
    
    test("should fetch an user", async () => {
        await persistUser(user)
        let res = await fetchUser({email:'fake@mail.com'})
        expect(res.email).toBe('fake@mail.com')
        
        
    });
    test("should persist a location", async () => {
        let userm = await persistUser(user)
        const location = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": userm
        }
        await persistLocation(location)
        
    });
    test("should fetch a location", async () => {
        let userm = await persistUser(user)
        const location = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": userm
        }
        await persistLocation(location)

        let res = await fetchLocation({})
        expect(res.name).toBe("test")
        
    });
    test("should update a location", async () => {
        let userm = await persistUser(user)
        let locationD = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": userm
        }
        let location = await persistLocation(locationD)
        locationD.address = "even faker"
        await updateLocation({location:{id:location.id},locationData:locationD})
        let res =  await fetchLocation({})
        expect(res.address).toBe("even faker")
        
    });
    test("checkIn should register a location and time for an user", async () => {
        let userm = await persistUser(user)
        let locationD = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": userm
        }
        let location = await persistLocation(locationD)

        await checkIn({user:userm, location})

        
    });
    test("checkinAllowed should return true if the user has no checkin without a checkout time", async () => {
        let userm = await persistUser(user)
        let locationD = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": userm
        }
        let location = await persistLocation(locationD)

        let res = await checkinAllowed({user:userm, location})

        expect(res).toBe(true)
        
    });
    test("checkoutAllowed should return false if there is no checkin made without a checkout", async () => {
        let userm = await persistUser(user)

        let res = await checkoutAllowed({user:userm})

        expect(res).toBe(false)
        
    });
    test("checkoutAllowed should return true if the user has a checkin without a checkout time", async () => {
        let userm = await persistUser(user)
        let locationD = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": userm
        }
        let location = await persistLocation(locationD)

        await checkIn({user:userm, location})

        let res = await checkoutAllowed({user:userm})

        expect(res).toBe(true)
        
    });

    
    test("persistDiagnostic should not explode", async () => {
        let userm = await persistUser(user)

        await persistDiagnostic({status:'positive', user: userm})
        
    });

    test("isInfected should return false if no possitive diagnosis was made, and if there is no possitive diagnosis after the curation timeframe", async () => {
        let userm = await persistUser(user)
        let res = await isInfected({user:userm})
        expect(res).toBe(false)
        await persistDiagnostic({user:userm, status:'positive', date: ndaysBefore(15)})
        res = await isInfected({user:userm})
        expect(res).toBe(false)

        await persistDiagnostic({user:userm, status:'positive', date: ndaysBefore(10)})
        await persistDiagnostic({user:userm, status:'negative', date: ndaysBefore(9)})
        res = await isInfected({user:userm})
        expect(res).toBe(false)
    });
    test("isInfected should return true if there is a possitive diagnosis after the curation timeframe", async () => {
        let userm = await persistUser(user)
        await persistDiagnostic({user:userm, status:'positive', date: ndaysBefore(14)})
        res = await isInfected({user:userm})
        expect(res).toBe(true)
    });
    test("possitiveDiagnosis should mark the possible contagions to the checks of all users that shared a timeframe with the infected user: CASE THAT THE INFECTED DID NOT MADE CHECKOUT", async () => {
        //TODO: permitir setear la hora de checkin y checkout a mano para poder probar
        let user1 = await persistUser({email:'uno@test.com'})
        let user2 = await persistUser({email:'dos@test.com'})
        let user3 = await persistUser({email:'tres@test.com'})
        let user4 = await persistUser({email:'cuatro@test.com'})

        let locationD = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": user1
        }
        let location = await persistLocation(locationD)

        await checkIn({user:user1, location, checkin:ndaysBefore(1)})
        await checkIn({user:user2, location, checkin:nMinutesBefore(45)})
        await checkIn({user:user3, location, checkin:nMinutesBefore(25)})//ese solo estuvo 25 minutos, 30 son necesarios para el conntagio
       
        await persistDiagnostic({user:user1, status:'positive', date: ndaysBefore(14)})
        res = await isPossiblyInfected({user:user1})
        expect(res).toBe(true)
        res = await isPossiblyInfected({user:user2})
        expect(res).toBe(true)
        res = await isPossiblyInfected({user:user3})
        expect(res).toBe(false)
        res = await isPossiblyInfected({user:user4})
        expect(res).toBe(false)
    });

    test("possitiveDiagnosis should mark the possible contagions to the checks of all users that shared a timeframe with the infected: CASE USER MAKING CHECKOUT", async () => {
        //TODO: permitir setear la hora de checkin y checkout a mano para poder probar
        let user1 = await persistUser({email:'uno@test.com'})
        let user2 = await persistUser({email:'dos@test.com'})
        let user3 = await persistUser({email:'tres@test.com'})
        let user4 = await persistUser({email:'cuatro@test.com'})

        let locationD = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": user1
        }
        let location = await persistLocation(locationD)

        await checkIn({user:user1, location, checkin:ndaysBefore(1)})
        await checkout(user1)
        await checkIn({user:user2, location, checkin:nMinutesBefore(45)})
        await checkIn({user:user3, location, checkin:nMinutesBefore(25)})//ese solo estuvo 25 minutos, 30 son necesarios para el conntagio
       
        await persistDiagnostic({user:user1, status:'positive', date: ndaysBefore(14)})
        res = await isPossiblyInfected({user:user1})
        expect(res).toBe(true)
        res = await isPossiblyInfected({user:user2})
        expect(res).toBe(true)
        res = await isPossiblyInfected({user:user3})
        expect(res).toBe(false)
        res = await isPossiblyInfected({user:user4})
        expect(res).toBe(false)
    });

    test("possitiveDiagnosis should mark the possible contagions to the checks of all users that shared a timeframe with the infected: CASE ALL USERS MAKING CHECKOUT", async () => {
        //TODO: permitir setear la hora de checkin y checkout a mano para poder probar
        let user1 = await persistUser({email:'uno@test.com'})
        let user2 = await persistUser({email:'dos@test.com'})
        let user3 = await persistUser({email:'tres@test.com'})
        let user4 = await persistUser({email:'cuatro@test.com'})

        let locationD = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": user1
        }
        let location = await persistLocation(locationD)

        await checkIn({user:user1, location, checkin:ndaysBefore(1)})
        await checkout(user1)
        await checkIn({user:user2, location, checkin:nMinutesBefore(45)})
        await checkout(user2,nMinutesBefore(5))
        await checkIn({user:user3, location, checkin:nMinutesBefore(25)})
        await checkout(user3, nMinutesBefore(15))//Este usuario no deberia eestar infectado x el poco tiempo de contacto
       
        await persistDiagnostic({user:user1, status:'positive', date: ndaysBefore(14)})
        res = await isPossiblyInfected({user:user1})
        expect(res).toBe(true)
        res = await isPossiblyInfected({user:user2})
        expect(res).toBe(true)
        res = await isPossiblyInfected({user:user3})
        expect(res).toBe(false)
        res = await isPossiblyInfected({user:user4})
        expect(res).toBe(false)
    });
})

function ndaysBefore(ndays){
    let timespan = new Date();
    timespan.setDate(timespan.getDate() - ndays);
    return timespan
}
function nMinutesBefore(minutes){
    return new Date((new Date()).getTime()  - 1000 * 60 * minutes)
 
 }