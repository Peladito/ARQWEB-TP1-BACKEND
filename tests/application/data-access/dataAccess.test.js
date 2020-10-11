require('dotenv').config()
require('mongoose');
const config = require('../../../config')
const {persistUser,
    userExists,
    deleteAll,
    fetchUser,
    persistLocation,
    fetchLocation,
    updateLocation,
    checkIn,
    checkinAllowed,
    checkoutAllowed,
    persistDiagnostic,
    isInfected,
    isPossiblyInfected,
    checkout,
    isAdmin,
    fetchAllLocations,
    fetchOwnedLocations,
    locationsCount,
    usersCount,
    infectedCount,
    possibleContagionCount,
    fetchConfigurations,
    fetchUnsentNotifications,
    sendNotifications
} = require('../../../data-access')(config)


describe("Data access", () => {
    const user = {
        email: 'fake@mail.com'
    }
    const admin = {
        email: 'admin@mail.com',
        isAdmin:true
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
            "owner": userm,
            "images":["one.png","two.png"]
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
            "owner": userm,
            "images":["one.png","two.png"]
        }
        await persistLocation(location)
        
        let res = await fetchLocation({})
        expect(res.name).toBe("test")
        expect(res.images.length).toBe(2)
        
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
    
    test("isAdmin should return true if thhe user is the system admin", async () => {
        let userm = await persistUser(admin)
        
        let res = await isAdmin({user:userm})
        
        expect(res).toBe(true)
        
    });
    test("isAdmin should return false if the user is not the system admin", async () => {
        let userm = await persistUser(user)
        
        let res = await isAdmin({user:userm})
        
        expect(res).toBe(false)
        
    });
    
    test("fetchOwnedLocations should return all locations :P", async () => {
        let user1 = await persistUser(user)
        let user2 = await persistUser({email:'dos@mail.com'})
        
        let locationD = {
            "name": "test3",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": user1
        }
        let locationD2 = {
            "name": "test4",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": user2
        }
        await persistLocation(locationD)
        await persistLocation(locationD2)
        let arr = await fetchOwnedLocations({user:user1})
        expect(arr.length).toBe(1)
        expect(arr[0].name).toBe(locationD.name)
        
    });
    test("fetchAllLocations should return all locations :P", async () => {
        let ad = await persistUser(admin)
        let user1 = await persistUser(user)
        let user2 = await persistUser({email:'dos@mail.com'})
        
        let locationD = {
            "name": "test3",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": user1
        }
        let locationD2 = {
            "name": "test4",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": user2
        }
        let loc1 = await persistLocation(locationD)
        let loc2 = await persistLocation(locationD2)
        await checkIn({user:user2, location:loc2, checkin:nMinutesBefore(45)})
        await checkIn({user:user1, location:loc1, checkin:nMinutesBefore(45)})
        await checkout(user1,nMinutesBefore(5))
        let arr = await fetchAllLocations({})
        expect(arr.length).toBe(2)
        expect(arr.find(l=>l.name=="test4").occupation).toBe(1)
        expect(arr.find(l=>l.name=="test3").occupation).toBe(0)
        
    });
    test("locationsCount should return the number of locations loaded in the database", async () => {
        let u = await persistUser(user)
        let n = await locationsCount({})
        expect(n).toBe(0)
        let locationD = {
            "name": "test4",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": u
        }
        await persistLocation(locationD)
        n = await locationsCount({})
        expect(n).toBe(1)

        locationD = {
            "name": "test5",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": u
        }
        await persistLocation(locationD)
        n = await locationsCount({})
        expect(n).toBe(2)

        
    });
    test("usersCount should return the number of locations loaded in the database", async () => {
        let u = await persistUser(user)
        let n = await usersCount({})
        expect(n).toBe(1)
        u = await persistUser(admin)
        n = await usersCount({})
        expect(n).toBe(2) 
    });
    test("infectedCount should return the number of users that are infected", async () => {
        let u = await persistUser(user)
        let a = await persistUser(admin)
        expect(await infectedCount({})).toBe(0)
        await persistDiagnostic({user:u, status:'positive', date: new Date()})
        expect(await infectedCount({})).toBe(1)
        await persistDiagnostic({user:a, status:'positive', date: new Date()})
        expect(await infectedCount({})).toBe(2)
        await persistDiagnostic({user:a, status:'negative', date: new Date()})
        expect(await infectedCount({})).toBe(1)
        
    });
    test("possibleContagionCount should return the number of users that might be infected", async () => {
        let u = await persistUser(user)
        let a = await persistUser(admin)
        locationD = {
            "name": "test5",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": u
        }
        let location = await persistLocation(locationD)
        await checkIn({user:u, location, checkin:nMinutesBefore(45)})
        await checkIn({user:a, location, checkin:nMinutesBefore(45)})

        expect(await possibleContagionCount({})).toBe(0)
        await persistDiagnostic({user:u, status:'positive', date: new Date()})
        expect(await possibleContagionCount({})).toBe(2)

        

        
    });
    test("fetchConfigurations should return the default configuration", async () => {
        const expectedConfig = {
            name: 'main',
            daysToBeCured: 15,
            minutesForContagionByContact: 30
        }
        let config = await fetchConfigurations({})
        expect(config).toMatchObject(expectedConfig)
    });
    test("fetchUnsentNotifications should return all possible contagions that weren't notified", async () => {


        let u = await persistUser(user)
        let a = await persistUser(admin)
        locationD = {
            "name": "test5",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": u
        }
        let location = await persistLocation(locationD)
        await checkIn({user:u, location, checkin:nMinutesBefore(45)})
        await checkIn({user:a, location, checkin:nMinutesBefore(45)})
        await persistDiagnostic({user:u, status:'positive', date: new Date()})


        const expectedNotif = {
            user: {
                email: expect.any(String)
            }
        }
        let [pendingNotification] = await fetchUnsentNotifications({})
        expect(pendingNotification).toMatchObject(expectedNotif)
    });
    test("sendNotifications should send mails and mark checks as notified", async () => {


        let u = await persistUser(user)
        let a = await persistUser(admin)
        locationD = {
            "name": "test5",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658,
            "owner": u
        }
        let location = await persistLocation(locationD)
        await checkIn({user:u, location, checkin:nMinutesBefore(45)})
        await checkIn({user:a, location, checkin:nMinutesBefore(45)})
        await persistDiagnostic({user:u, status:'positive', date: new Date()})


        
        let notifications = await fetchUnsentNotifications({})
        await sendNotifications(notifications)
        notifications = await fetchUnsentNotifications({})
        expect(notifications.length).toBe(0)
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