const config = require('../../config')
const dataAccess = require('../../data-access')(config)
const uoc = require('../../application')(dataAccess)
const httpInterface = require('../../interfaces/http')(uoc, {port:3000})

const supertest = require('supertest')
const request = supertest(httpInterface)
describe("HTTP interface", () => {
    beforeEach(async ()=>{
        await dataAccess.deleteAll()
    })
    test("POST /users should allow to create an user", async () => {
        
        const res = await request.post('/user').send({email:'jhon@salchichon.com'})
        expect(res.status).toBe(200)
    })
    
    
    test("POST /users should throw 409 if user already exists", async () => {
        
        await request.post('/user').send({email:'jhon@salchichon.com'})
        const res = await request.post('/user').send({email:'jhon@salchichon.com'})
        expect(res.status).toBe(409)
    })
    
    test("POST /location should allow to create a location ", async () => {
        await request.post('/user').send({email:'jhon@salchichon2.com'})
        const location = {
            "name": "test2",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658
        }
        const res = await request.post('/location').auth('jhon@salchichon2.com','').send(location)
        expect(res.status).toBe(200)
        expect(res.body.id).not.toBe(null)
    })
    test("POST /location should allow to create more than one location", async () => {
        await request.post('/user').send({email:'jhon@salchichon2.com'})
        let location = {
            "name": "test2",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658
        }
        let res = await request.post('/location').auth('jhon@salchichon2.com','').send(location)
        expect(res.status).toBe(200)
        expect(res.body.id).not.toBe(null)
        location = {
            "name": "test3",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658
        }
        res = await request.post('/location').auth('jhon@salchichon2.com','').send(location)
        expect(res.status).toBe(200)
        expect(res.body.id).not.toBe(null)
    })
    test("POST /location should allow to send images from the location ", async () => {
        await request.post('/user').send({email:'jhon@salchichon2.com'})

        const res = await request.post('/location').auth('jhon@salchichon2.com','')
        .field("name","test2")
        .field("description","test2")
        .field("maxCapacity", 10)
        .field("address", "fakestreet 1234")
        .field("latitude",23.022552)
        .field("longitude",23.022552)
        .attach('images','./tests/interface/testimage.png')
        expect(res.status).toBe(200)
    })
    test("POST /location should throw 409 if the location already exists", async () => {
        await request.post('/user').send({email:'jhon@salchichon.com'})
        const location = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658
        }
        await request.post('/location').auth('jhon@salchichon.com','').send(location)
        const res = await request.post('/location').auth('jhon@salchichon.com','').send(location)
        expect(res.status).toBe(409)
    })
    test("POST /location should throw 403 if the actor does not exists", async () => {
        const location = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658
        }
        const res = await request.post('/location').auth('jhon@salchichon.com','').send(location)
        expect(res.status).toBe(403)
    })
    test("GET /location/:id should return a location by its id", async () => {
        await request.post('/user').send({email:'jhon@salchichon.com'})
        const location = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658
        }
        const res = await request.post('/location').auth('jhon@salchichon.com','').send(location)
        const res2 = await request.get('/location/'+res.body.id).auth('jhon@salchichon.com','')
        expect(res.body.id).toBe(res2.body.id)
    })
    
    test("PUT /location/:id should return404 if the location does not exists", async () => {
        await request.post('/user').send({email:'jhon@salchichon.com'})
        let location = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658
        }
        const res = await request.put('/location/5f7e24a92cf4418988523fef').auth('jhon@salchichon.com','').send(location)
        
        expect(res.status).toBe(404)
        
    })
    test("POST /user/checkin/:id should return ok", async () => {
        await request.post('/user').send({email:'jhon@salchichon.com'})
        let location = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658
        }
        const res = await request.post('/location').auth('jhon@salchichon.com','').send(location)
        location.description = "different description"
        const res2 = await request.post('/user/checkin/'+res.body.id).auth('jhon@salchichon.com','')
        expect(res2.status).toBe(200)
    })
    test("POST /user/checkout should return ok", async () => {
        await request.post('/user').send({email:'jhon@salchichon.com'})
        let location = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658
        }
        const res = await request.post('/location').auth('jhon@salchichon.com','').send(location)
        await request.post('/user/checkin/'+res.body.id).auth('jhon@salchichon.com','')
        const res2 = await request.post('/user/checkout').auth('jhon@salchichon.com','')
        expect(res2.status).toBe(200)
    })
    test("POST /user/checkout should return 409 if it was not made a previous checkin", async () => {
        await request.post('/user').send({email:'jhon@salchichon.com'})
        let location = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658
        }
        const res = await request.post('/location').auth('jhon@salchichon.com','').send(location)
        location.description = "different description"
        const res2 = await request.post('/user/checkout').auth('jhon@salchichon.com','')
        expect(res2.status).toBe(409)
    })
    test("POST /user/diagnostic should return ok ", async () => {
        await request.post('/user').send({email:'jhon@salchichon.com'})
        
        const res2 = await request.post('/user/diagnostic/'+(new Date()).getTime()).auth('jhon@salchichon.com','')
        expect(res2.status).toBe(200)
    })
    test("DELETE /user/diagnostic should return ok ", async () => {
        await request.post('/user').send({email:'jhon@salchichon.com'})
        
        const res2 = await request.delete('/user/diagnostic/'+(new Date()).getTime()).auth('jhon@salchichon.com','')
        expect(res2.status).toBe(200)
    })
    
    test("GET /user should return ok ", async () => {
        await request.post('/user').send({email:'jhon@salchichon.com'})
        const expectedOutput = {
            "email": 'jhon@salchichon.com',
            "isCheckedIn": expect.any(Boolean),
            "isInfected": expect.any(Boolean),
            "possiblyInfected": expect.any(Boolean)
        }
        const res2 = await request.get('/user').auth('jhon@salchichon.com','')
        expect(res2.status).toBe(200)
        expect(res2.body).toMatchObject(expectedOutput)
    })
    test("GET /locations should return ok ", async () => {
        await dataAccess.persistUser({email:"admin", isAdmin:true})
        await request.post('/user').send({email:'jhon@salchichon.com'})
        let location = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658
        }
        await request.post('/location').auth('jhon@salchichon.com','').send(location)
        let res2 = await request.get('/location').auth('jhon@salchichon.com','')
        expect(res2.status).toBe(200)
        expect(res2.body.length).toBe(1)

        res2 = await request.get('/location').auth('admin','')
        expect(res2.status).toBe(200)
        expect(res2.body.length).toBe(1)
        expect(res2.body[0].occupation).toBe(0)
    })
    test("GET /statistics should return ok when accessing with the user and 403 with a normal user ", async () => {
        await dataAccess.persistUser({email:"admin@admin.com", isAdmin:true})
        await request.post('/user').send({email:'jhon@salchichon.com'})
        let location = {
            "name": "test",
            "description": "a comon test",
            "maxCapacity": 10,
            "address": "fakestreet 1234",
            "latitude": 23.022552,
            "longitude": 56.3658
        }
        const expecterdResponse = {
            nLocations: expect.any(Number),
            nUsers: expect.any(Number),
            nInfections: expect.any(Number),
            nRisks: expect.any(Number)
        }
        await request.post('/location').auth('jhon@salchichon.com','').send(location)
        let res2 = await request.get('/statistics').auth('admin@admin.com','')
        expect(res2.status).toBe(200)
        expect(res2.body).toMatchObject(expecterdResponse)
        res2 = await request.get('/statistics').auth('jhon@salchichon.com','')
        expect(res2.status).toBe(403)

    })
    test("GET /configurations should return the configurations to the admin user", async () => {
        await dataAccess.persistUser({email:"admin@admin.com", isAdmin:true})
        let res2 = await request.get('/configurations').auth('admin@admin.com','')
        const expecterdResponse = {
            daysToBeCured: expect.any(Number),
            minutesForContagionByContact: expect.any(Number),
        }
        expect(res2.body).toMatchObject(expecterdResponse)

    })
    test("PUT /configurations should update configurations", async () => {
        await dataAccess.persistUser({email:"admin@admin.com", isAdmin:true})
        let res2 = await request.get('/configurations').auth('admin@admin.com','')
        res2 = await request.put('/configurations').auth('admin@admin.com','').send({daysToBeCured:4, minutesForContagionByContact:4 })
        const expecterdResponse = {
            daysToBeCured: 4,
            minutesForContagionByContact: 4,
        }
        expect(res2.status).toBe(200)
        res2 = await request.get('/configurations').auth('admin@admin.com','')
        expect(res2.body).toMatchObject(expecterdResponse)
    })
    
});