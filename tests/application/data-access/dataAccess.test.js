require('dotenv').config()
require('mongoose');
const config = require('../../../config')
const {persistUser, userExists, deleteAll, fetchUser, persistLocation, fetchLocation} = require('../../../data-access')(config)


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
    
})