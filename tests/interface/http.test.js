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

    test("PUT /location/:id should return a location by its id", async () => {
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
        const res2 = await request.put('/location/'+res.body.id).auth('jhon@salchichon.com','').send(location)
        const res3 = await request.get('/location/'+res.body.id).auth('jhon@salchichon.com','')
        expect(res2.body.description).toBe(location.description)
        expect(res3.body.description).toBe(location.description)
    })
    test("PUT /user/checkin/:id should return ok", async () => {
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
});