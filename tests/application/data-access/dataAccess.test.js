require('dotenv').config()
require('mongoose');
const config = require('../../../config')
const {persistUser, userExists, deleteAll, fetchUser, persistLocation, fetchLocation, updateLocation, checkIn, checkinAllowed} = require('../../../data-access')(config)


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
        await checkIn({user:userm, location}) 
        let res = await checkinAllowed({user:userm, location})

        expect(res).toBe(false)
        
    });

})